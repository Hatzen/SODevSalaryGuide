import React from 'react'
import { Checkbox, FormGroup, FormControl, FormControlLabel, Slider, FormLabel, Box, TextField } from '@material-ui/core'
import { inject, observer } from 'mobx-react'
import { injectClause, StoreProps } from '../stores/storeHelper'
import Autocomplete from '@mui/material/Autocomplete'
import { AbstractCsvRowMapper } from '../mapper/AbstractCsvRowMapper'
import { Gender, GenderRecord } from '../model/gender'
import ControlComponentWrapper from './controlComponentWrapper'
import CoolSelect from './CoolSelect'
import { AVAILABLE_YEARS } from '../model/constantMetaData'

class ControlPane extends React.Component<StoreProps> {
    private key = 0

    render(): JSX.Element {
        // Focused false as otherwise the labels change their color unintentionally.
        return (
            <div style={{padding: 50, overflow: 'scroll', position: 'relative', top: 0, left: 0, right: 0, maxHeight: 'calc(100% - 100px)'}}>
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
            </div>
        )
    }

    get years(): JSX.Element {
        const config = this.props.controlStore!

        // Find currently selected year (assuming only one is selected)
        let selectedYear: number | null = null
        for (const [year, isSelected] of Object.entries(config.controlState.selectedYears)) {
            if (isSelected) {
                selectedYear = parseInt(year)
                break
            }
        }

        const filterdValues = AVAILABLE_YEARS
        const autoCompleteComponent = (<Autocomplete
            options={filterdValues}
            value={selectedYear}
            onChange={this.handleYearChange.bind(this)}
            // getOptionLabel={([k, v]) => k as string +  ' (' + v + ')'}
            renderOption={(props, option, { selected }) => (
                <li {...props}>
                    <Checkbox
                        // icon={icon}
                        // checkedIcon={checkedIcon}
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
    
    handleYearChange(year: number | null): void {
        if (year !== null) {
            this.props.controlStore!.setSelectedYear(year)
        }
    }
    
    get abilities(): JSX.Element {
        const filterdValues =
            [...AbstractCsvRowMapper.abilities]
                .filter(([k, v]) => v > 10 )
                .map(([k, v]) => k as string)
                // .map(([k, v]) => k as string +  ' (' + v + ')')
        //
        const autoCompleteComponent = (<Autocomplete
            multiple
            id="checkboxes-tags-demo"
            options={filterdValues}
            disableCloseOnSelect
            onChange={this.handleChangesForAbilities.bind(this)}
            // getOptionLabel={([k, v]) => k as string +  ' (' + v + ')'}
            renderOption={(props, option, { selected }) => (
                <li {...props}>
                    <Checkbox
                        // icon={icon}
                        // checkedIcon={checkedIcon}
                        style={{ marginRight: 8 }}
                        checked={selected}
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
                    // valueLabelFormat={numFormatter}
                    // marks={followersMarks}
                    // scale={scaleValues}
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
            [...AbstractCsvRowMapper.countries]
                .filter(([k, v]) => v > 10 )
                .map(([k, v]) => k as string)
                // .map(([k, v]) => k as string +  ' (' + v + ')')
        const autoCompleteComponent = (<Autocomplete
            multiple
            id="checkboxes-tags-demo"
            options={filterdValues}
            disableCloseOnSelect
            onChange={this.handleChangesForCountries.bind(this)}
            // getOptionLabel={([k, v]) => k as string +  ' (' + v + ')'}
            renderOption={(props, option, { selected }) => (
                <li {...props}>
                    <Checkbox
                        // icon={icon}
                        // checkedIcon={checkedIcon}
                        style={{ marginRight: 8 }}
                        checked={selected}
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
            [...AbstractCsvRowMapper.educations]
                .filter(([k, v]) => v > 10 )
                .map(([k, v]) => k as string)
                // .map(([k, v]) => k as string +  ' (' + v + ')')
        const autoCompleteComponent = (<Autocomplete
            multiple
            id="checkboxes-tags-demo"
            options={filterdValues}
            disableCloseOnSelect
            onChange={this.handleChangesForDegree.bind(this)}
            // getOptionLabel={([k, v]) => k as string +  ' (' + v + ')'}
            renderOption={(props, option, { selected }) => (
                <li {...props}>
                    <Checkbox
                        // icon={icon}
                        // checkedIcon={checkedIcon}
                        style={{ marginRight: 8 }}
                        checked={selected}
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

    // TODO: Get General generator for checkbox, slider, dropdown (company size)
    // Add generic header for: collapsible, active, weight
    getCheckboxesForValues(selectedValues: Gender[], enumKeys: Gender[]): JSX.Element {
        const values = enumKeys.map(g => g.toString())
        
        const checkboxes = values.map(value => {
            const check = selectedValues.includes((Gender as unknown as GenderRecord)[value])
            return (
                <FormControlLabel
                    key={this.key++}
                    control={<Checkbox
                        onChange={() => { this.props.controlStore!.setGenders((Gender as unknown as GenderRecord)[value]) }}
                        defaultChecked={check}
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
                    // valueLabelFormat={numFormatter}
                    // marks={followersMarks}
                    // scale={scaleValues}
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

    // https://stackoverflow.com/a/43746799/8524651
    private handleChanges(event: React.SyntheticEvent<HTMLInputElement>, newValue: boolean): void {
        event.persist() // allow native event access (see: https://facebook.github.io/react/docs/events.html)
        const year = parseInt(event.currentTarget.name, 10)
        this.props.controlStore!.selectedYears[year] = newValue
    }

}

export default inject(...injectClause)(observer(ControlPane))