import React, { ChangeEvent } from 'react'
import { Checkbox, FormGroup, FormControl, FormControlLabel, Grid, Slider, FormLabel, Box, TextField } from '@material-ui/core'
import { inject, observer } from 'mobx-react'
import { injectClause, StoreProps } from '../stores/storeHelper'
import Autocomplete from '@mui/material/Autocomplete'
import { AbstractCsvRowMapper } from '../mapper/AbstractCsvRowMapper'
import { Gender } from '../model/gender'
import ControlComponentWrapper from './controlComponentWrapper'

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
        const selectableYears = []
        for (let i = 2011; i < 2023; i++) {
            selectableYears.push(i.toString())
        }
        const yearOption = selectableYears.map((year: string) => {
            const yearSelected = config.controlState.selectedYears[parseInt(year)]
            return <FormControlLabel key={this.key++} control={
                <Checkbox name={year} defaultChecked={yearSelected} onChange={this.handleChanges.bind(this)}/>
            } label={year} />
        })
        return (
            <Grid container
                key={1}
                direction="row"
                justifyContent="center"
                alignItems="center"
                style={{width: '100%'}}
            >
                <Grid item
                    style={{width: '100%'}}>
                    {yearOption}
                </Grid>
                <br></br>
            </Grid>
        )
    }
    
    get abilities(): any {
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

    get slider(): any {
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
    
    get countries(): any {
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
    
    get degrees(): any {
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
    
    get gender(): any {
        const values = this.props.controlStore!.genders
        const checkboxes = this.getCheckboxesForValues(values, Gender)
        
        return (<ControlComponentWrapper
            title='Gender'
            controlComponent={checkboxes}
            isEnabled={this.props.controlStore!.gendersFilterActive}
            enable={(event, value) => { this.props.controlStore!.setGendersFilterActive(value)}}>
        </ControlComponentWrapper>)
    }

    // TODO: Get General generator for checkbox, slider, dropdown (company size)
    // Add generic header for: collapsible, active, weight
    // TODO: Replace any with Enum.class
    getCheckboxesForValues<T>(selectedValues: T[], enumClass: any): any {
        // Get enum values of typescript: https://stackoverflow.com/a/48768775/8524651
        const values = Object.keys(enumClass).filter((item) => {
            return isNaN(Number(item))
        })
        
        const checkboxes = values.map(value => {
            // TODO: How to get values
            const check = selectedValues.find(selected => (selected as any).toString() === value) != null
            return (
                <FormControlLabel key={this.key++} control={<Checkbox onChange={(event, selected) => {
                    this.props.controlStore!.setGenders(value as any)
                }} defaultChecked={check} />} label={value} />
            )
        })
        return (
            <div>
                {checkboxes}
            </div>
        )
    }
    
    get sliderForCompanySize(): any {
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

    
    handleChangesForCountries(event: ChangeEvent<any>, value: string[]): void {
        this.props.controlStore!.setCountries(value)
    }

    handleChangesForDegree(event: ChangeEvent<any>, value: string[]): void {
        this.props.controlStore!.setDegrees(value)
    }

    handleChangesForAbilities(event: ChangeEvent<any>, value: string[]): void {
        this.props.controlStore!.setAbilities(value)
    }

    handleChange(event: ChangeEvent<any>, value: number | number[]): void {
        this.props.controlStore!.setExp(value as number[])
    }
    
    handleChangeForCompanySize(event: ChangeEvent<any>, value: number | number[]): void {
        this.props.controlStore!.setCompanySize(value as number[])
    }

    // https://stackoverflow.com/a/43746799/8524651
    private handleChanges(event: any, newValue: any): void {
        event.persist() // allow native event access (see: https://facebook.github.io/react/docs/events.html)
        const year = event.target.name
        this.props.controlStore!.selectedYears[year] = newValue
    }

}

export default inject(...injectClause)(observer(ControlPane))