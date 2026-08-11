import React from 'react'
import { Checkbox, FormGroup, FormControl, Slider, Box, TextField, Typography, IconButton } from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { inject, observer } from 'mobx-react'
import { injectClause, StoreProps } from '../stores/storeHelper'
import Autocomplete from '@mui/material/Autocomplete'
import { AbstractCsvRowMapper } from '../mapper/AbstractCsvRowMapper'
import { Gender } from '../model/gender'
import { Currency } from '../model/currency'
import ControlComponentWrapper from './controlComponentWrapper'
import { AVAILABLE_YEARS } from '../model/constantMetaData'
import { uiStore } from '../stores/uiStore'
import translationStore from '../stores/translationStore'

interface ControlPaneState {
    refreshKey: number
    anchorEl: HTMLElement | null
}

class ControlPane extends React.Component<StoreProps, ControlPaneState> {
    private key = 0
    private loadedPendingState = false

    constructor(props: StoreProps) {
        super(props)
        this.state = {
            refreshKey: 0,
            anchorEl: null
        }
    }

    componentDidMount(): void {
        this.loadPendingStateIfNeeded()
    }

    componentDidUpdate(): void {
        this.loadPendingStateIfNeeded()
    }

    loadPendingStateIfNeeded(): void {
        const cs = this.props.controlStore!
        if (cs.pendingState) {
            const targetYear = cs.pendingState.selectedYear
            const dataReady = AbstractCsvRowMapper.abilities.size > 0 && AbstractCsvRowMapper.countries.size > 0

            if (dataReady && !this.loadedPendingState) {
                this.loadedPendingState = true
                cs.loadPendingState()
                if (targetYear && targetYear !== AVAILABLE_YEARS[AVAILABLE_YEARS.length - 1]) {
                    AbstractCsvRowMapper.clearDistinctValues()
                    this.props.entryStore!.initParser(targetYear)
                }
                this.setState({ refreshKey: this.state.refreshKey + 1 })
            }
        }
    }

    render(): JSX.Element {
        const t = translationStore.t
        const lastUpdate = uiStore.lastFilterUpdateTime
        const lastUpdateTime = lastUpdate > 0 ? new Date(lastUpdate).toLocaleTimeString() : 'Not yet updated'
        const isMobile = uiStore.isMobileView

        return (
            <div key={this.state.refreshKey} style={{padding: isMobile ? 12 : 20, overflow: 'auto', position: 'relative', top: 0, left: 0, right: 0, maxHeight: '100%'}}>
                {this.headerWithMenu}
                <Typography variant="caption" style={{fontSize: '0.7em', color: '#888', display: 'block', marginBottom: '10px'}}>
                    {t.lastFilterUpdate}: {lastUpdateTime}
                </Typography>
                <Box sx={{ display: 'flex' }}>
                    <FormControl focused={false} component="fieldset" variant="standard">
                        <FormGroup key={1}>
                            {this.years}
                            {this.currency}
                            <Typography variant="body2" style={{ color: '#666', fontSize: '0.85em', marginTop: '10px'}}>{t.controlPaneHint}</Typography>
                            {this.slider}
                            {this.abilities}
                            {this.companySizeInputs}
                            {this.countries}
                            {this.degrees}
                            {this.gender}
                            {this.salaryFilter}
                        </FormGroup>
                    </FormControl>
                </Box>
            </div>
        )
    }

    get headerWithMenu(): JSX.Element {
        const t = translationStore.t
        return (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <Typography variant="h6" style={{ fontFamily: 'Roboto, Helvetica, Arial, sans-serif' }}>
                    {t.filters}
                </Typography>
                <IconButton onClick={this.handleMenuClick.bind(this)} size="small">
                    <MoreVertIcon />
                </IconButton>
                {this.menu}
            </div>
        )
    }

    handleMenuClick = (event: React.MouseEvent<HTMLElement>): void => {
        this.setState({ anchorEl: event.currentTarget })
    }

    handleMenuClose = (): void => {
        this.setState({ anchorEl: null })
    }

    get menu(): JSX.Element | null {
        const t = translationStore.t
        const anchorEl = this.state.anchorEl
        return (
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={this.handleMenuClose}
            >
                <MenuItem onClick={this.handleSaveToSession}>{t.saveToSession}</MenuItem>
                <MenuItem onClick={this.handleLoadFromSession}>{t.loadFromSession}</MenuItem>
                <MenuItem onClick={this.handleDownloadJson}>{t.downloadJson}</MenuItem>
                <MenuItem onClick={this.handleUploadJson}>{t.uploadJson}</MenuItem>
                <MenuItem onClick={this.handleShareLink}>{t.shareLink}</MenuItem>
            </Menu>
        )
    }

    get years(): JSX.Element {
        const t = translationStore.t
        const config = this.props.controlStore!
        const selectedYear: string | null = config.controlState.selectedYear
        const filteredValues = AVAILABLE_YEARS
        const autoCompleteComponent = (<Autocomplete
            options={filteredValues}
            value={selectedYear}
            onChange={this.handleYearChange.bind(this)}
            renderOption={(props, option, { selected }) => (
                <li {...props}>
                    {option}
                </li>
            )}
            style={{ width: '100%' }}
            slotProps={{ popper: { style: { width: 'auto', minWidth: 'auto', maxWidth: 400 } } }}
            renderInput={(params) => (
                <TextField style={{ }} {...params} label={t.yearLabel} color="secondary" fullWidth />
            )}
        />)
        return (<div style={{marginTop: '8px'}}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <Typography variant="body1" color="secondary">{t.yearLabel}</Typography>
                <Typography variant="body2" style={{ color: '#666', fontSize: '0.85em' }}>
                    (2011 - 2025)
                </Typography>
            </div>
            {autoCompleteComponent}
        </div>)
    }

    get currency(): JSX.Element {
        const t = translationStore.t
        const allCurrencies = Object.values(Currency)
        const autoCompleteComponent = (<Autocomplete
            options={allCurrencies}
            value={this.props.controlStore!.selectedCurrency}
            onChange={this.handleCurrencyChange.bind(this)}
            renderOption={(props, option) => (
                <li {...props}>
                    {option}
                </li>
            )}
            style={{ width: '100%' }}
            slotProps={{ popper: { style: { width: 'auto', minWidth: 'auto', maxWidth: 400 } } }}
            renderInput={(params) => (
                <TextField style={{ }} {...params} label={t.currencyLabel} color="secondary" fullWidth />
            )}
        />)
        return (<div style={{marginTop: '8px'}}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <Typography variant="body1" color="secondary">{t.currencyLabel}</Typography>
                <Typography variant="body2" style={{ color: '#666', fontSize: '0.85em' }}>
                    ({allCurrencies.length})
                </Typography>
            </div>
            {autoCompleteComponent}
        </div>)
    }

    handleYearChange = (event: React.SyntheticEvent<Element, Event>, value: string | null): void => {
        if (value !== null) {
            console.log('[DEBUG] Year changed to:', value)
            this.props.controlStore!.setSelectedYear(value)
            AbstractCsvRowMapper.clearDistinctValues()
            this.props.entryStore!.initParser(value)
        }
    }

    get abilities(): JSX.Element {
        const t = translationStore.t
        const allAbilities = Array.from(AbstractCsvRowMapper.abilities).map(([k, v]) => ({ key: k as string, label: v.label }))
        const autoCompleteComponent = (<Autocomplete
            multiple
            id="checkboxes-tags-demo"
            options={allAbilities}
            getOptionLabel={(option) => option.label}
            isOptionEqualToValue={(option, value) => option.key === value?.key}
            disableCloseOnSelect
            value={allAbilities.filter(a => this.props.controlStore!.abilities.includes(a.key))}
            onChange={this.handleChangesForAbilities.bind(this)}
            renderOption={(props, option, state) => (
                <li {...props}>
                    <Checkbox
                        style={{ marginRight: 8 }}
                        checked={state.selected}
                    />
                    {option.label}
                </li>
            )}
            style={{ width: '100%' }}
            slotProps={{ popper: { style: { width: 'auto', minWidth: 'auto', maxWidth: 400 } } }}
            renderInput={(params) => (
                <TextField style={{ }} {...params} label={t.abilitiesLabel} color="secondary" fullWidth />
            )}
        />)
        return (<ControlComponentWrapper
            title={t.abilitiesLabel}
            controlComponent={autoCompleteComponent}
            isEnabled={this.props.controlStore!.abilitiesFilterActive}
            enable={(event, value) => { this.props.controlStore!.setAbilitiesFilterActive(value)}}
            count={allAbilities.length}>
        </ControlComponentWrapper>)
    }

    get slider(): JSX.Element {
        const t = translationStore.t
        const slider =
            (
                <Slider
                    style={{ width: '90%', minWidth: '200px' }}
                    value={this.valuesForExp}
                    min={0}
                    step={1}
                    max={40}
                    onChange={this.handleChange.bind(this)}
                    valueLabelDisplay="auto"
                    aria-labelledby="non-linear-slider"
                    color="secondary"
                />
            )
        const experienceCount = AbstractCsvRowMapper.years.size
        return (<ControlComponentWrapper
            title={t.experienceLabel}
            controlComponent={slider}
            isEnabled={this.props.controlStore!.expirienceFilterActive}
            enable={(event, value) => { this.props.controlStore!.setExpirienceFilterActive(value)}}
            count={experienceCount}>
        </ControlComponentWrapper>)
    }

    get countries(): JSX.Element {
        const t = translationStore.t
        const allCountries = Array.from(AbstractCsvRowMapper.countries).map(([k, v]) => ({ key: k as string, label: v.label }))
        const autoCompleteComponent = (<Autocomplete
            multiple
            id="checkboxes-tags-demo"
            options={allCountries}
            getOptionLabel={(option) => option.label}
            isOptionEqualToValue={(option, value) => option.key === value?.key}
            disableCloseOnSelect
            value={allCountries.filter(a => this.props.controlStore!.countries.includes(a.key))}
            onChange={this.handleChangesForCountries.bind(this)}
            renderOption={(props, option, state) => (
                <li {...props}>
                    <Checkbox
                        style={{ marginRight: 8 }}
                        checked={state.selected}
                    />
                    {option.label}
                </li>
            )}
            style={{ width: '100%' }}
            slotProps={{ popper: { style: { width: 'auto', minWidth: 'auto', maxWidth: 400 } } }}
            renderInput={(params) => (
                <TextField style={{ }} {...params} label={t.countriesLabel} color="secondary" fullWidth />
            )}
        />)
        return (<ControlComponentWrapper
            title={t.countriesLabel}
            controlComponent={autoCompleteComponent}
            isEnabled={this.props.controlStore!.countriesFilterActive}
            enable={(event, value) => { this.props.controlStore!.setCountriesFilterActive(value)}}
            count={allCountries.length}>
        </ControlComponentWrapper>)
    }

    get degrees(): JSX.Element {
        const t = translationStore.t
        const allDegrees = Array.from(AbstractCsvRowMapper.educations).map(([k, v]) => ({ key: k as string, label: v.label }))
        const autoCompleteComponent = (<Autocomplete
            multiple
            id="checkboxes-tags-demo"
            options={allDegrees}
            getOptionLabel={(option) => option.label}
            isOptionEqualToValue={(option, value) => option.key === value?.key}
            disableCloseOnSelect
            value={allDegrees.filter(a => this.props.controlStore!.degrees.includes(a.key))}
            onChange={this.handleChangesForDegree.bind(this)}
            renderOption={(props, option, state) => (
                <li {...props}>
                    <Checkbox
                        style={{ marginRight: 8 }}
                        checked={state.selected}
                    />
                    {option.label}
                </li>
            )}
            style={{ width: '100%' }}
            slotProps={{ popper: { style: { width: 'auto', minWidth: 'auto', maxWidth: 400 } } }}
            renderInput={(params) => (
                <TextField style={{ }} {...params} label={t.degreeLabel} color="secondary" fullWidth />
            )}
        />)
        return (<ControlComponentWrapper
            title={t.degreeLabel}
            controlComponent={autoCompleteComponent}
            isEnabled={this.props.controlStore!.degreeFilterActive}
            enable={(event, value) => { this.props.controlStore!.setDegreeFilterActive(value)}}
            count={allDegrees.length}>
        </ControlComponentWrapper>)
    }

    get valuesForExp(): number[] {
        return this.props.controlStore!.expirienceInYears
    }

    get gender(): JSX.Element {
        const t = translationStore.t
        const values = this.props.controlStore!.genders
        const checkboxes = this.getCheckboxesForValues(values, Object.values(Gender).filter((v): v is Gender => typeof v === 'string'))
        const genderCount = AbstractCsvRowMapper.genders.size
        return (<ControlComponentWrapper
            title={t.genderLabel}
            controlComponent={checkboxes}
            isEnabled={this.props.controlStore!.gendersFilterActive}
            enable={(event, value) => { this.props.controlStore!.setGendersFilterActive(value)}}
            count={genderCount}>
        </ControlComponentWrapper>)
    }

    getCheckboxesForValues(selectedValues: Gender[], enumKeys: Gender[]): JSX.Element {
        const t = translationStore.t
        const genderTranslations: Record<string, string> = {
            MALE: t.genderMale,
            FEMALE: t.genderFemale,
            OTHER: t.genderOther
        }
        const values = enumKeys.map(g => g.toString())
        const checkboxes = values.map(value => {
            const check = selectedValues.includes(Gender[value as keyof typeof Gender])
            return (
                <div key={this.key++} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Checkbox
                        checked={check}
                        color="secondary"
                        onChange={() => { this.props.controlStore!.setGenders(Gender[value as keyof typeof Gender]) }}
                    />
                    <Typography variant="body1">{genderTranslations[value] || value}</Typography>
                </div>
            )
        })
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {checkboxes}
            </div>
        )
    }

    get companySizeInputs(): JSX.Element {
        const t = translationStore.t
        const isMobile = uiStore.isMobileView
        const currentMin = this.props.controlStore!.companySize[0]
        const currentMax = this.props.controlStore!.companySize[1]
        const values = this.props.controlStore!.companySizeValues
        const allCompanySizes = AbstractCsvRowMapper.companySize ?? new Map()
        const inputs = (
            <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap'}}>
                <TextField
                    label={t.companySizeFrom}
                    type="number"
                    value={currentMin ?? ''}
                    onChange={this.handleMinCompanySizeChange.bind(this)}
                    inputProps={{ min: values.min, max: values.max, step: 1 }}
                    style={{ width: isMobile ? '45%' : 120 }}
                    color="secondary"
                />
                <TextField
                    label={t.companySizeTo}
                    type="number"
                    value={currentMax ?? ''}
                    onChange={this.handleMaxCompanySizeChange.bind(this)}
                    inputProps={{ min: values.min, max: values.max, step: 1 }}
                    style={{ width: isMobile ? '45%' : 120 }}
                    color="secondary"
                />
            </div>
        )
        return (<ControlComponentWrapper
            title={t.companySizeLabel}
            controlComponent={inputs}
            isEnabled={this.props.controlStore!.companySizeFilterActive}
            enable={(event, value) => { this.props.controlStore!.setCompanySizeFilterActive(value)}}
            count={allCompanySizes.size}>
        </ControlComponentWrapper>)
    }

    get salaryFilter(): JSX.Element {
        const t = translationStore.t
        const cs = this.props.controlStore!
        const salaryMin = cs.salaryThresholdMin
        const salaryMax = cs.salaryThresholdMax

        const slider = (
            <Slider
                style={{ width: '90%', minWidth: '200px' }}
                value={[salaryMin, salaryMax]}
                min={0}
                step={10000}
                max={500000}
                onChange={this.handleSalaryThresholdChange.bind(this)}
                valueLabelDisplay="auto"
                valueLabelFormat={(value: number) => `${(value / 1000).toLocaleString()}k`}
                disableSwap
                color="secondary"
            />
        )

        return (<div style={{marginBottom: '16px'}}>
            <ControlComponentWrapper
                title={t.salaryFilterLabel}
                controlComponent={slider}
                isEnabled={this.props.controlStore!.enableSalaryFilter}
                enable={(event, value) => { this.props.controlStore!.setEnableSalaryFilter(value)}}>
            </ControlComponentWrapper>
        </div>)
    }

    handleMinCompanySizeChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const value = event.target.value === '' ? null : parseInt(event.target.value, 10)
        this.props.controlStore!.setCompanySizeFromMin(value)
    }

    handleMaxCompanySizeChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const value = event.target.value === '' ? null : parseInt(event.target.value, 10)
        this.props.controlStore!.setCompanySizeFromMax(value)
    }

    handleSalaryThresholdChange = (_event: Event | React.SyntheticEvent, value: number | number[]): void => {
        const cs = this.props.controlStore!
        if (Array.isArray(value) && value.length === 2) {
            cs.setSalaryThresholdMin(value[0])
            cs.setSalaryThresholdMax(value[1])
        }
    }

    handleChangesForCountries(event: React.ChangeEvent<unknown>, value: { key: string, label: string }[]): void {
        this.props.controlStore!.setCountries(value.map(v => v.key))
    }

    handleChangesForDegree(event: React.ChangeEvent<unknown>, value: { key: string, label: string }[]): void {
        this.props.controlStore!.setDegrees(value.map(v => v.key))
    }

    handleChangesForAbilities(event: React.ChangeEvent<unknown>, value: { key: string, label: string }[]): void {
        this.props.controlStore!.setAbilities(value.map(v => v.key))
    }

    handleChange(_event: Event | React.SyntheticEvent, value: number | number[]): void {
        this.props.controlStore!.setExp(value as number[])
    }

    handleCurrencyChange = (event: React.SyntheticEvent<Element, Event>, value: Currency | null): void => {
        if (value !== null) {
            this.props.controlStore!.setSelectedCurrency(value)
        }
    }

    handleSaveToSession = (): void => {
        const state = this.props.controlStore!.getSessionState()
        localStorage.setItem('controlPaneSettings', JSON.stringify(state, null, 2))
        this.handleMenuClose()
    }

    handleLoadFromSession = (): void => {
        const saved = localStorage.getItem('controlPaneSettings')
        if (saved) {
            const parsed = JSON.parse(saved)
            this.props.controlStore!.loadFromSessionState(parsed)
            this.setState({ refreshKey: this.state.refreshKey + 1 })
        }
        this.handleMenuClose()
    }

    handleDownloadJson = (): void => {
        const state = this.props.controlStore!.getSessionState()
        const json = JSON.stringify(state, null, 2)
        const blob = new Blob([json], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'control-pane-settings.json'
        a.click()
        URL.revokeObjectURL(url)
        this.handleMenuClose()
    }

    handleUploadJson = (): void => {
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = '.json'
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0]
            if (file) {
                const reader = new FileReader()
                reader.onload = () => {
                    const parsed = JSON.parse(reader.result as string)
                    this.props.controlStore!.loadFromSessionState(parsed)
                    this.setState({ refreshKey: this.state.refreshKey + 1 })
                }
                reader.readAsText(file)
            }
        }
        input.click()
        this.handleMenuClose()
    }

    handleShareLink = (): void => {
        const t = translationStore.t
        const state = this.props.controlStore!.getSessionState()
        const encoded = encodeURIComponent(JSON.stringify(state))
        const url = `${window.location.origin}${window.location.pathname}?settings=${encoded}`
        navigator.clipboard.writeText(url).then(() => {
            alert(t.shareLinkSuccess)
        })
        this.handleMenuClose()
    }

}

export default inject(...injectClause)(observer(ControlPane))