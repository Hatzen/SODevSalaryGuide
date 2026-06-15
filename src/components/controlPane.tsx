import React from 'react'
import { Checkbox, FormGroup, FormControl, FormControlLabel, Slider, Box, TextField, Typography, IconButton } from '@material-ui/core'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import { inject, observer } from 'mobx-react'
import { injectClause, StoreProps } from '../stores/storeHelper'
import Autocomplete from '@mui/material/Autocomplete'
import { AbstractCsvRowMapper } from '../mapper/AbstractCsvRowMapper'
import { Gender } from '../model/gender'
import { Currency } from '../model/currency'
import ControlComponentWrapper from './controlComponentWrapper'
import { AVAILABLE_YEARS } from '../model/constantMetaData'
import { uiStore } from '../stores/uiStore'

interface ControlPaneState {
    refreshKey: number
    anchorEl: HTMLElement | null
}

interface CurrencyChangeEvent {
    selected: boolean
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
        const lastUpdate = uiStore.lastFilterUpdateTime
        const lastUpdateTime = lastUpdate > 0 ? new Date(lastUpdate).toLocaleTimeString() : 'Not yet updated'
        
        return (
            <div key={this.state.refreshKey} style={{padding: 50, overflow: 'scroll', position: 'relative', top: 0, left: 0, right: 0, maxHeight: 'calc(100% - 100px)'}}>
                {this.headerWithMenu}
                <Typography variant="caption" style={{fontSize: '0.7em', color: '#888', display: 'block', marginBottom: '10px'}}>
                    Last filter update: {lastUpdateTime}
                </Typography>
                <Box sx={{ display: 'flex' }}>
                    <FormControl focused={false} component="fieldset" variant="standard">
                        <FormGroup key={1}>
                            {this.years}
                            {this.currency}
                            {this.gender}
                            {this.slider}
                            {this.abilities}
                            {this.companySizeInputs}
                            {this.countries}
                            {this.degrees}
                            {this.salaryFilter}
                        </FormGroup>
                    </FormControl>
                </Box>
            </div>
        )
    }

    get headerWithMenu(): JSX.Element {
        return (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <Typography variant="h6" style={{ fontFamily: 'Roboto, Helvetica, Arial, sans-serif' }}>
                    Filters
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
        const anchorEl = this.state.anchorEl
        return (
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={this.handleMenuClose}
            >
                <MenuItem onClick={this.handleSaveToSession}>Save to Session</MenuItem>
                <MenuItem onClick={this.handleLoadFromSession}>Load from Session</MenuItem>
                <MenuItem onClick={this.handleDownloadJson}>Download JSON</MenuItem>
                <MenuItem onClick={this.handleUploadJson}>Upload JSON</MenuItem>
                <MenuItem onClick={this.handleShareLink}>Share Link</MenuItem>
            </Menu>
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
            renderOption={(props, option, { selected }: CurrencyChangeEvent) => (
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

    get currency(): JSX.Element {
        const allCurrencies = Object.values(Currency)
        const autoCompleteComponent = (<Autocomplete
            options={allCurrencies}
            value={this.props.controlStore!.selectedCurrency}
            onChange={this.handleCurrencyChange.bind(this)}
            renderOption={(props, option, { selected }: CurrencyChangeEvent) => (
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
                <TextField style={{ padding: '10px' }} {...params} label="Currency" />
            )}
        />)
        return (<ControlComponentWrapper
            title='Display Currency'
            controlComponent={autoCompleteComponent}
            isEnabled={true}
            enable={() => { /* no-op */ }}
            count={allCurrencies.length}>
        </ControlComponentWrapper>)
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
        const allAbilities = Array.from(AbstractCsvRowMapper.abilities).map(([k, v]) => ({ key: k as string, count: v }))
        const filterdValues = allAbilities.map(a => a.key)
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
            enable={(event, value) => { this.props.controlStore!.setAbilitiesFilterActive(value)}}
            count={allAbilities.length}>
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
        const experienceCount = AbstractCsvRowMapper.years.size
        return (<ControlComponentWrapper
            title='Years of Expirience'
            controlComponent={slider}
            isEnabled={this.props.controlStore!.expirienceFilterActive}
            enable={(event, value) => { this.props.controlStore!.setExpirienceFilterActive(value)}}
            count={experienceCount}>
        </ControlComponentWrapper>)
    }

    get countries(): JSX.Element {
        const allCountries = Array.from(AbstractCsvRowMapper.countries).map(([k, v]) => ({ key: k as string, count: v }))
        const filterdValues = allCountries.map(a => a.key)
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
            enable={(event, value) => { this.props.controlStore!.setCountriesFilterActive(value)}}
            count={allCountries.length}>
        </ControlComponentWrapper>)
    }

    get degrees(): JSX.Element {
        const allDegrees = Array.from(AbstractCsvRowMapper.educations).map(([k, v]) => ({ key: k as string, count: v }))
        const filterdValues = allDegrees.map(a => a.key)
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
            enable={(event, value) => { this.props.controlStore!.setDegreeFilterActive(value)}}
            count={allDegrees.length}>
        </ControlComponentWrapper>)
    }

    get valuesForExp(): number[] {
        return this.props.controlStore!.expirienceInYears
    }

    get gender(): JSX.Element {
        const values = this.props.controlStore!.genders
        const checkboxes = this.getCheckboxesForValues(values, Object.values(Gender).filter((v): v is Gender => typeof v === 'string'))
        const genderCount = AbstractCsvRowMapper.genders.size
        return (<ControlComponentWrapper
            title='Gender'
            controlComponent={checkboxes}
            isEnabled={this.props.controlStore!.gendersFilterActive}
            enable={(event, value) => { this.props.controlStore!.setGendersFilterActive(value)}}
            count={genderCount}>
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

    get companySizeInputs(): JSX.Element {
        const currentMin = this.props.controlStore!.companySize[0]
        const currentMax = this.props.controlStore!.companySize[1]
        const values = this.props.controlStore!.companySizeValues
        const allCompanySizes = AbstractCsvRowMapper.companySize ?? new Map()
        const inputs = (
            <div>
                <TextField
                    label="From"
                    type="number"
                    value={currentMin ?? ''}
                    onChange={this.handleMinCompanySizeChange.bind(this)}
                    inputProps={{ min: values.min, max: values.max, step: 1 }}
                    style={{ width: 120 }}
                />
                <TextField
                    label="To"
                    type="number"
                    value={currentMax ?? ''}
                    onChange={this.handleMaxCompanySizeChange.bind(this)}
                    inputProps={{ min: values.min, max: values.max, step: 1 }}
                    style={{ width: 120 }}
                />
            </div>
        )
        return (<ControlComponentWrapper
            title='Company Size'
            controlComponent={inputs}
            isEnabled={this.props.controlStore!.companySizeFilterActive}
            enable={(event, value) => { this.props.controlStore!.setCompanySizeFilterActive(value)}}
            count={allCompanySizes.size}>
        </ControlComponentWrapper>)
    }

    get salaryFilter(): JSX.Element {
        return (<ControlComponentWrapper
            title='Salary Threshold Filter'
            controlComponent={<Typography variant="body2" style={{ padding: '10px', color: '#666', fontSize: '0.85em' }}>When disabled: consider all salaries. When enabled: filter 10k-250k</Typography>}
            isEnabled={this.props.controlStore!.enableSalaryFilter}
            enable={(event, value) => { this.props.controlStore!.setEnableSalaryFilter(value)}}>
        </ControlComponentWrapper>)
    }

    handleMinCompanySizeChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const value = event.target.value === '' ? null : parseInt(event.target.value, 10)
        this.props.controlStore!.setCompanySizeFromMin(value)
    }

    handleMaxCompanySizeChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const value = event.target.value === '' ? null : parseInt(event.target.value, 10)
        this.props.controlStore!.setCompanySizeFromMax(value)
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
        const state = this.props.controlStore!.getSessionState()
        const encoded = encodeURIComponent(JSON.stringify(state))
        const url = `${window.location.origin}${window.location.pathname}?settings=${encoded}`
        navigator.clipboard.writeText(url).then(() => {
            alert('Share link copied to clipboard!')
        })
        this.handleMenuClose()
    }

}

export default inject(...injectClause)(observer(ControlPane))