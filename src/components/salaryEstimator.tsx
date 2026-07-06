import React from 'react'
import { inject, observer } from 'mobx-react'
import { injectClause, StoreProps } from '../stores/storeHelper'
import translationStore from '../stores/translationStore'
import SurveyEntry from '../model/surveyEntry'
import { Gender } from '../model/gender'
import { AbstractCsvRowMapper } from '../mapper/AbstractCsvRowMapper'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import Slider from '@mui/material/Slider'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'

interface EstimatorState {
    expirienceInYears: [number, number]
    abilities: string[]
    countries: string[]
    degrees: string[]
    companySizeMin: number | null
    companySizeMax: number | null
    genders: Gender[]
    calculated: boolean
}

interface Stats {
    count: number
    median: number
    mean: number
    std: number
    lower: number
    upper: number
}

const MIN_SAMPLE_GOOD = 200
const MIN_SAMPLE_MEDIUM = 30

class SalaryEstimator extends React.Component<StoreProps, EstimatorState> {

    constructor(props: StoreProps) {
        super(props)
        const cs = this.props.controlStore!
        this.state = {
            expirienceInYears: cs.expirienceInYears,
            abilities: [...cs.abilities],
            countries: [...cs.countries],
            degrees: [...cs.degrees],
            companySizeMin: cs.companySize[0],
            companySizeMax: cs.companySize[1],
            genders: [...cs.genders],
            calculated: false
        }
    }

    private convertSalary(entry: SurveyEntry): number {
        const currencyValues = this.props.entryStore!.currencyValues
        const selectedCurrency = this.props.controlStore!.selectedCurrency
        const rawSalary = entry._salary
        const entryCurrencyRatio = currencyValues?.getRatioByCode(entry.currency) ?? 1
        const usdSalary = rawSalary / entryCurrencyRatio
        const targetCurrencyRatio = currencyValues?.getRatioByCode(selectedCurrency) ?? 1
        return usdSalary * targetCurrencyRatio
    }

    private allEntries(): SurveyEntry[] {
        const year = parseInt(this.props.entryStore!.selectedYear, 10)
        return this.props.entryStore!.parsedDataByYear[year]?.resultSet ?? []
    }

    private matchesFilter(entry: SurveyEntry, opts: {
        exp: [number, number],
        abilities: string[],
        countries: string[],
        degrees: string[],
        companyMin: number | null,
        companyMax: number | null,
        genders: Gender[]
    }): boolean {
        const exp = entry.expirienceInYears
        if (exp && !(exp.min >= opts.exp[0] && exp.max <= opts.exp[1])) return false
        if (opts.abilities.length > 0 && !(entry.abilities ?? []).some(a => opts.abilities.includes(a))) return false
        if (opts.countries.length > 0 && !opts.countries.includes(entry.country!)) return false
        if (opts.degrees.length > 0 && !opts.degrees.includes(entry.highestDegree!)) return false
        if (opts.genders.length > 0 && !opts.genders.includes(entry.gender!)) return false
        const cs = entry.companySize
        if (cs) {
            if (opts.companyMin !== null && opts.companyMin !== undefined && cs.max < opts.companyMin) return false
            if (opts.companyMax !== null && opts.companyMax !== undefined && cs.min > opts.companyMax) return false
        }
        return true
    }

    private computeStats(entries: SurveyEntry[]): Stats | null {
        if (entries.length === 0) return null
        const salaries = entries.map(e => this.convertSalary(e))
        const sorted = [...salaries].sort((a, b) => a - b)
        const median = sorted[Math.floor(sorted.length / 2)]
        const mean = salaries.reduce((a, b) => a + b, 0) / salaries.length
        const variance = salaries.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / salaries.length
        const std = Math.sqrt(variance)
        return {
            count: salaries.length,
            median,
            mean,
            std,
            lower: mean - std,
            upper: mean + std
        }
    }

    private currentFilter(): {
        exp: [number, number],
        abilities: string[],
        countries: string[],
        degrees: string[],
        companyMin: number | null,
        companyMax: number | null,
        genders: Gender[]
        } {
        return {
            exp: this.state.expirienceInYears,
            abilities: this.state.abilities,
            countries: this.state.countries,
            degrees: this.state.degrees,
            companyMin: this.state.companySizeMin,
            companyMax: this.state.companySizeMax,
            genders: this.state.genders
        }
    }

    private get selectedStats(): Stats | null {
        const entries = this.allEntries().filter(e => this.matchesFilter(e, this.currentFilter()))
        return this.computeStats(entries)
    }

    private qualityLabel(stats: Stats | null): { text: string; color: string } {
        const t = translationStore.t
        if (!stats) return { text: t.estimatorNoData, color: '#b00020' }
        if (stats.count >= MIN_SAMPLE_GOOD && stats.std / stats.mean < 0.6) {
            return { text: t.estimatorQualityGood, color: '#2e7d32' }
        }
        if (stats.count >= MIN_SAMPLE_MEDIUM) {
            return { text: t.estimatorQualityMedium, color: '#ed6c02' }
        }
        return { text: t.estimatorQualityLow, color: '#b00020' }
    }

    private get similarDatasets(): { label: string; stats: Stats | null }[] {
        const all = this.allEntries()
        const base = this.currentFilter()
        const result: { label: string; stats: Stats | null }[] = []

        if (base.abilities.length > 0) {
            const without = { ...base, abilities: [] as string[] }
            result.push({
                label: translationStore.t.estimatorAbilities + ': -',
                stats: this.computeStats(all.filter(e => this.matchesFilter(e, without)))
            })
        }
        if (base.countries.length > 0) {
            const without = { ...base, countries: [] as string[] }
            result.push({
                label: translationStore.t.estimatorCountries + ': -',
                stats: this.computeStats(all.filter(e => this.matchesFilter(e, without)))
            })
        }
        if (base.degrees.length > 0) {
            const without = { ...base, degrees: [] as string[] }
            result.push({
                label: translationStore.t.estimatorDegree + ': -',
                stats: this.computeStats(all.filter(e => this.matchesFilter(e, without)))
            })
        }
        if (base.genders.length > 0) {
            const without = { ...base, genders: [] as Gender[] }
            result.push({
                label: translationStore.t.estimatorGender + ': -',
                stats: this.computeStats(all.filter(e => this.matchesFilter(e, without)))
            })
        }
        return result
    }

    private renderField(title: string, component: JSX.Element): JSX.Element {
        return (
            <Box sx={{ marginBottom: '16px' }}>
                <Typography variant="body2" style={{ fontWeight: 600, marginBottom: '4px' }}>{title}</Typography>
                {component}
            </Box>
        )
    }

    private get experienceField(): JSX.Element {
        return (
            <Slider
                style={{ width: '90%', minWidth: '200px' }}
                value={this.state.expirienceInYears}
                min={0}
                step={1}
                max={40}
                onChange={(_e, v) => this.setState({ expirienceInYears: v as [number, number] })}
                valueLabelDisplay="auto"
                color="secondary"
            />
        )
    }

    private get abilitiesField(): JSX.Element {
        const t = translationStore.t
        const isMobile = this.props.uiStore!.isMobileView
        const options = Array.from(AbstractCsvRowMapper.abilities).map(([k]) => k as string)
        return (
            <Autocomplete
                multiple
                options={options}
                disableCloseOnSelect
                value={this.state.abilities}
                onChange={(_e, v) => this.setState({ abilities: v })}
                renderInput={(params) => <TextField {...params} label={t.estimatorAbilities} color="secondary" />}
                style={{ width: isMobile ? '100%' : 350 }}
            />
        )
    }

    private get countriesField(): JSX.Element {
        const t = translationStore.t
        const isMobile = this.props.uiStore!.isMobileView
        const options = Array.from(AbstractCsvRowMapper.countries).map(([k]) => k as string)
        return (
            <Autocomplete
                multiple
                options={options}
                disableCloseOnSelect
                value={this.state.countries}
                onChange={(_e, v) => this.setState({ countries: v })}
                renderInput={(params) => <TextField {...params} label={t.estimatorCountries} color="secondary" />}
                style={{ width: isMobile ? '100%' : 350 }}
            />
        )
    }

    private get degreesField(): JSX.Element {
        const t = translationStore.t
        const isMobile = this.props.uiStore!.isMobileView
        const options = Array.from(AbstractCsvRowMapper.educations).map(([k]) => k as string)
        return (
            <Autocomplete
                multiple
                options={options}
                disableCloseOnSelect
                value={this.state.degrees}
                onChange={(_e, v) => this.setState({ degrees: v })}
                renderInput={(params) => <TextField {...params} label={t.estimatorDegree} color="secondary" />}
                style={{ width: isMobile ? '100%' : 350 }}
            />
        )
    }

    private get gendersField(): JSX.Element {
        const t = translationStore.t
        const values = this.state.genders
        const enumKeys = Object.values(Gender).filter((v): v is Gender => typeof v === 'string')
        const genderTranslations: Record<string, string> = {
            MALE: t.genderMale,
            FEMALE: t.genderFemale,
            OTHER: t.genderOther
        }
        const checkboxes = enumKeys.map(g => (
            <FormControlLabel
                key={g}
                control={
                    <Checkbox
                        checked={values.includes(Gender[g as keyof typeof Gender])}
                        color="secondary"
                        onChange={() => {
                            const gv = Gender[g as keyof typeof Gender]
                            const next = values.includes(gv)
                                ? values.filter(x => x !== gv)
                                : [...values, gv]
                            this.setState({ genders: next })
                        }}
                    />
                }
                label={genderTranslations[g] || g}
            />
        ))
        return <div>{checkboxes}</div>
    }

    private get companySizeField(): JSX.Element {
        const t = translationStore.t
        const isMobile = this.props.uiStore!.isMobileView
        return (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <TextField
                    label={t.companySizeFrom}
                    type="number"
                    value={this.state.companySizeMin ?? ''}
                    onChange={(e) => this.setState({ companySizeMin: e.target.value === '' ? null : parseInt(e.target.value, 10) })}
                    style={{ width: isMobile ? '45%' : 120 }}
                    color="secondary"
                />
                <TextField
                    label={t.companySizeTo}
                    type="number"
                    value={this.state.companySizeMax ?? ''}
                    onChange={(e) => this.setState({ companySizeMax: e.target.value === '' ? null : parseInt(e.target.value, 10) })}
                    style={{ width: isMobile ? '45%' : 120 }}
                    color="secondary"
                />
            </div>
        )
    }

    render(): JSX.Element {
        const t = translationStore.t
        const currency = this.props.controlStore!.selectedCurrency
        const fmt = (v: number): string => Math.round(v).toLocaleString() + ' ' + currency
        const stats = this.state.calculated ? this.selectedStats : null
        const quality = this.qualityLabel(stats)
        const similar = this.state.calculated ? this.similarDatasets : []
        const baseMedian = stats?.median ?? 0

        return (
            <div style={{ padding: 20, overflow: 'auto', height: '100%' }}>
                <Typography variant="body1" style={{ marginBottom: '16px' }}>{t.estimatorIntro}</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '24px' }}>
                    <Paper elevation={2} sx={{ padding: '16px', flex: '1 1 320px', minWidth: 300 }}>
                        {this.renderField(t.estimatorExperience, this.experienceField)}
                        {this.renderField(t.estimatorAbilities, this.abilitiesField)}
                        {this.renderField(t.estimatorCountries, this.countriesField)}
                        {this.renderField(t.estimatorDegree, this.degreesField)}
                        {this.renderField(t.estimatorCompanySize, this.companySizeField)}
                        {this.renderField(t.estimatorGender, this.gendersField)}
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => this.setState({ calculated: true })}
                            style={{ backgroundColor: '#F48024' }}
                        >
                            {t.estimatorCalculate}
                        </Button>
                    </Paper>

                    <Box sx={{ flex: '1 1 320px', minWidth: 300 }}>
                        {!this.state.calculated && (
                            <Paper elevation={2} sx={{ padding: '16px' }}>
                                <Typography variant="body2" style={{ color: '#888' }}>{t.estimatorIntro}</Typography>
                            </Paper>
                        )}
                        {stats && (
                            <Paper elevation={2} sx={{ padding: '16px', marginBottom: '16px' }}>
                                <Typography variant="h6" style={{ color: '#F48024' }}>{t.estimatorResultTitle}</Typography>
                                <Typography variant="h4" style={{ fontWeight: 700, margin: '8px 0' }}>{fmt(stats.median)}</Typography>
                                <Typography variant="caption" style={{ color: '#888' }}>
                                    {t.estimatorSampleSize.replace('{count}', String(stats.count))}
                                </Typography>
                                <Box sx={{ marginTop: '12px' }}>
                                    <Typography variant="body2"><b>{t.estimatorTypicalRange}:</b> {fmt(stats.lower)} – {fmt(stats.upper)}</Typography>
                                    <Typography variant="body2"><b>{t.meanLabel}:</b> {fmt(stats.mean)} | <b>{t.stdLabel}:</b> {fmt(stats.std)}</Typography>
                                </Box>
                                <Box sx={{ marginTop: '12px', padding: '8px', backgroundColor: '#F5F5F5', borderRadius: '4px' }}>
                                    <Typography variant="body2"><b>{t.estimatorDataQuality}:</b> <span style={{ color: quality.color, fontWeight: 600 }}>{quality.text}</span></Typography>
                                </Box>
                            </Paper>
                        )}
                        {this.state.calculated && !stats && (
                            <Paper elevation={2} sx={{ padding: '16px' }}>
                                <Typography variant="body1" style={{ color: '#b00020' }}>{t.estimatorNoData}</Typography>
                            </Paper>
                        )}

                        {similar.length > 0 && (
                            <Paper elevation={2} sx={{ padding: '16px' }}>
                                <Typography variant="h6" style={{ color: '#F48024', marginBottom: '4px' }}>{t.estimatorSimilarTitle}</Typography>
                                <Typography variant="caption" style={{ color: '#888', display: 'block', marginBottom: '8px' }}>{t.estimatorSimilarHint}</Typography>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>{t.estimatorSameAsSelected}</TableCell>
                                            <TableCell align="right">{t.medianLabel}</TableCell>
                                            <TableCell align="right">{t.estimatorDifference}</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>{t.estimatorSameAsSelected}</TableCell>
                                            <TableCell align="right">{fmt(baseMedian)}</TableCell>
                                            <TableCell align="right">-</TableCell>
                                        </TableRow>
                                        {similar.map((s, i) => (
                                            <TableRow key={i}>
                                                <TableCell>{s.label}</TableCell>
                                                <TableCell align="right">{s.stats ? fmt(s.stats.median) : '-'}</TableCell>
                                                <TableCell align="right">{s.stats ? fmt(s.stats.median - baseMedian) : '-'}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Paper>
                        )}
                    </Box>
                </Box>
            </div>
        )
    }
}

export default inject(...injectClause)(observer(SalaryEstimator))
