import React from 'react'
import { Checkbox, FormGroup, FormControl, FormControlLabel, Slider, FormLabel, Box, TextField, Button } from '@material-ui/core'
import { inject, observer } from 'mobx-react'
import { injectClause, StoreProps } from '../stores/storeHelper'
import Autocomplete from '@mui/material/Autocomplete'
import { AbstractCsvRowMapper } from '../mapper/AbstractCsvRowMapper'
import { Gender } from '../model/gender'
import ControlComponentWrapper from './controlComponentWrapper'
import { AVAILABLE_YEARS } from '../model/constantMetaData'

interface ControlPaneState {
    refreshKey: number
}

class ControlPane extends React.Component<StoreProps, ControlPaneState> {
    private key = 0
    private loadedPendingState = false

    constructor(props: StoreProps) {
        super(props)
        this.state = {
            refreshKey: 0
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
        if (!this.loadedPendingState && cs.pendingState && AbstractCsvRowMapper.abilities.size > 0 && AbstractCsvRowMapper.countries.size > 0) {
            this.loadedPendingState = true
            const targetYear = cs.pendingState.selectedYear
            cs.loadPendingState()
            if (targetYear && targetYear !== AVAILABLE_YEARS[AVAILABLE_YEARS.length - 1]) {
                setTimeout(() => {
                    AbstractCsvRowMapper.clearDistinctValues()
                    this.props.entryStore!.initParser(targetYear)
                }, 100)
            }
        }
    }

    render(): JSX.Element {
        return (
            <div key={this.state.refreshKey} style={{padding: 50, overflow: 'scroll', position: 'relative', top: 0, left: 0, right: 0, maxHeight: 'calc(100% - 100px)'}}>
                <Box sx={{ display: 'flex' }}>
                    <FormControl focused={false} component="fieldset" variant="standard">
                        <FormLabel component="legend">Include Data from years</FormLabel>
                        <FormGroup key={1}>
                            {this.years}
                            {this.slider}
                            {this.gender}
                            {this.abilities}
                            {this.sliderForCompanySize}
                            {this.countries}
                            {this.degrees}
                        </FormGroup>
                    </FormControl>
                </Box>
                {this.sessionButtons}
            </div>
        )
    }

    get years(): JSX.Element {
        const config = this.props.controlStore!
        const selectedYear: string | null = config.controlState.selectedYear
        const filteredValues = AVAILABLE_YEARS
        const autoCompleteComponent = (<Autocomplete
            options={filteredValues}
            value={selectedYear}
            onChange={this.handleYearChange.bind(this)}
            renderOption={(props, option, { selected }) => (
                <li {...props}>
                    <Checkbox
                        style={{ marginRight: 8 }}
                        checked={selected}
                    />
                    {option}
                </li>
            )}
            style={{ width: 250 }}
            renderInput={(params) => (
                <TextField style={{ padding: '10px' }} {...params} label="Show data for year" />
            )}
        />)
        return autoCompleteComponent
    }
    
    handleYearChange = (event: React.SyntheticEvent<Element, Event>, value: string | null, reason: any, details: any) => {
        if (value !== null) {
            this.props.controlStore!.setSelectedYear(value)
            AbstractCsvRowMapper.clearDistinctValues()
            this.props.entryStore!.initParser(value)
        }
    }
    
    get abilities(): JSX.Element {
        const filterdValues =
            Array.from(AbstractCsvRowMapper.abilities)
                .filter(([k, v]) => v > 10 )
                .map(([k, v]) => k as string)
        const autoCompleteComponent = (<Autocomplete
            multiple
            id="checkboxes-tags-demo"
            options={filterdValues}
            disableCloseOnSelect
            value={this.props.controlStore!.abilities}
            onChange={this.handleChangesForAbilities.bind(this)}
            renderOption={(props, option, state) => (
                <li {...props}>
                    <Checkbox
                        style={{ marginRight: 8 }}
                        checked={state.selected}
                    />
                    {option}
                </li>
            )}
            style={{ width: 250 }}
            renderInput={(params) => (
                <TextField style={{ padding: '10px' }} {...params} label="SQL, Java, etc." />
            )}
        />)
        return (<ControlComponentWrapper
            title='Tools and Technologies'
            controlComponent={autoCompleteComponent}
            isEnabled={this.props.controlStore!.abilitiesFilterActive}
            enable={(event, value) => { this.props.controlStore!.setAbilitiesFilterActive(value)}}>
        </ControlComponentWrapper>)
    }

    get slider(): JSX.Element {
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
                />
            )
        return (<ControlComponentWrapper
            title='Years of Expirience'
            controlComponent={slider}
            isEnabled={this.props.controlStore!.expirienceFilterActive}
            enable={(event, value) => { this.props.controlStore!.setExpirienceFilterActive(value)}}>
        </ControlComponentWrapper>)
    }
    
    get countries(): JSX.Element {
        const filterdValues =
            Array.from(AbstractCsvRowMapper.countries)
                .filter(([k, v]) => v > 10 )
                .map(([k, v]) => k as string)
        const autoCompleteComponent = (<Autocomplete
            multiple
            id="checkboxes-tags-demo"
            options={filterdValues}
            disableCloseOnSelect
            value={this.props.controlStore!.countries}
            onChange={this.handleChangesForCountries.bind(this)}
            renderOption={(props, option, state) => (
                <li {...props}>
                    <Checkbox
                        style={{ marginRight: 8 }}
                        checked={state.selected}
                    />
                    {option}
                </li>
            )}
            style={{ width: 250 }}
            renderInput={(params) => (
                <TextField style={{ padding: '10px' }} {...params} label="USA, Japan, Germany etc." />
            )}
        />)
        return (<ControlComponentWrapper
            title='Countries'
            controlComponent={autoCompleteComponent}
            isEnabled={this.props.controlStore!.countriesFilterActive}
            enable={(event, value) => { this.props.controlStore!.setCountriesFilterActive(value)}}>
        </ControlComponentWrapper>)
    }
    
    get degrees(): JSX.Element {
        const filterdValues =
            Array.from(AbstractCsvRowMapper.educations)
                .filter(([k, v]) => v > 10 )
                .map(([k, v]) => k as string)
        const autoCompleteComponent = (<Autocomplete
            multiple
            id="checkboxes-tags-demo"
            options={filterdValues}
            disableCloseOnSelect
            value={this.props.controlStore!.degrees}
            onChange={this.handleChangesForDegree.bind(this)}
            renderOption={(props, option, state) => (
                <li {...props}>
                    <Checkbox
                        style={{ marginRight: 8 }}
                        checked={state.selected}
                    />
                    {option}
                </li>
            )}
            style={{ width: 250 }}
            renderInput={(params) => (
                <TextField style={{ padding: '10px' }} {...params} label="Bachelor, Master, etc." />
            )}
        />)
        return (<ControlComponentWrapper
            title='Highest Degree'
            controlComponent={autoCompleteComponent}
            isEnabled={this.props.controlStore!.degreeFilterActive}
            enable={(event, value) => { this.props.controlStore!.setDegreeFilterActive(value)}}>
        </ControlComponentWrapper>)
    }

    get valuesForExp(): number[] {
        return this.props.controlStore!.expirienceInYears
    }
    
    get gender(): JSX.Element {
        const values = this.props.controlStore!.genders
        const checkboxes = this.getCheckboxesForValues(values, Object.values(Gender).filter((v): v is Gender => typeof v === 'string'))
        return (<ControlComponentWrapper
            title='Gender'
            controlComponent={checkboxes}
            isEnabled={this.props.controlStore!.gendersFilterActive}
            enable={(event, value) => { this.props.controlStore!.setGendersFilterActive(value)}}>
        </ControlComponentWrapper>)
    }

    getCheckboxesForValues(selectedValues: Gender[], enumKeys: Gender[]): JSX.Element {
        const values = enumKeys.map(g => g.toString())
        const checkboxes = values.map(value => {
            const check = selectedValues.includes(Gender[value as keyof typeof Gender])
            return (
                <FormControlLabel
                    key={this.key++}
                    control={<Checkbox
                        checked={check}
                        onChange={() => { this.props.controlStore!.setGenders(Gender[value as keyof typeof Gender]) }}
                    />}
                    label={value}
                />
            )
        })
        return (
            <div>
                {checkboxes}
            </div>
        )
    }
    
    get sliderForCompanySize(): JSX.Element {
        const values = this.props.controlStore!.companySizeValues
        const slider =
            (
                <Slider
                    style={{ width: '90%', minWidth: '200px' }}
                    value={this.props!.controlStore?.companySize}
                    min={values.min}
                    step={values.steps}
                    max={values.max}
                    onChange={this.handleChangeForCompanySize.bind(this)}
                    valueLabelDisplay="auto"
                    aria-labelledby="non-linear-slider"
                />
            )
        return (<ControlComponentWrapper
            title='Company Size'
            controlComponent={slider}
            isEnabled={this.props.controlStore!.companySizeFilterActive}
            enable={(event, value) => { this.props.controlStore!.setCompanySizeFilterActive(value)}}>
        </ControlComponentWrapper>)
    }

    handleChangesForCountries(event: React.ChangeEvent<unknown>, value: string[]): void {
        this.props.controlStore!.setCountries(value)
    }

    handleChangesForDegree(event: React.ChangeEvent<unknown>, value: string[]): void {
        this.props.controlStore!.setDegrees(value)
    }

    handleChangesForAbilities(event: React.ChangeEvent<unknown>, value: string[]): void {
        this.props.controlStore!.setAbilities(value)
    }

    handleChange(event: React.ChangeEvent<unknown>, value: number | number[]): void {
        this.props.controlStore!.setExp(value as number[])
    }
    
    handleChangeForCompanySize(event: React.ChangeEvent<unknown>, value: number | number[]): void {
        this.props.controlStore!.setCompanySize(value as number[])
    }

    handleSaveToSession = (): void => {
        const state = this.props.controlStore!.getSessionState()
        sessionStorage.setItem('controlPaneSettings', JSON.stringify(state, null, 2))
    }

    handleLoadFromSession = (): void => {
        const saved = sessionStorage.getItem('controlPaneSettings')
        if (saved) {
            const parsed = JSON.parse(saved)
            this.props.controlStore!.loadFromSessionState(parsed)
            this.setState({ refreshKey: this.state.refreshKey + 1 })
        }
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
    }

    handleShareLink = (): void => {
        const state = this.props.controlStore!.getSessionState()
        const encoded = encodeURIComponent(JSON.stringify(state))
        const url = `${window.location.origin}${window.location.pathname}?settings=${encoded}`
        navigator.clipboard.writeText(url).then(() => {
            alert('Share link copied to clipboard!')
        })
    }

    get sessionButtons(): JSX.Element {
        return (
            <Box style={{ display: 'flex', gap: '8px', marginTop: '16px', flexWrap: 'wrap' }}>
                <Button variant="contained" size="small" onClick={this.handleSaveToSession}>Save to Session</Button>
                <Button variant="contained" size="small" onClick={this.handleLoadFromSession}>Load from Session</Button>
                <Button variant="contained" size="small" onClick={this.handleDownloadJson}>Download JSON</Button>
                <Button variant="contained" size="small" onClick={this.handleUploadJson}>Upload JSON</Button>
                <Button variant="contained" size="small" onClick={this.handleShareLink}>Share Link</Button>
            </Box>
        )
    }

}

export default inject(...injectClause)(observer(ControlPane))