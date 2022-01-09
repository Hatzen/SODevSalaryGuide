import React, { ChangeEvent } from 'react'
import { Checkbox, FormGroup, FormControl, FormControlLabel, Grid, Slider, FormLabel, Box, TextField } from '@material-ui/core'
import { inject, observer } from 'mobx-react'
import { Gender } from '../model/config'
import { injectClause, StoreProps } from '../stores/storeHelper'
import Autocomplete from '@mui/material/Autocomplete'
import { AbstractCsvRowMapper } from '../mapper/AbstractCsvRowMapper'

class ControlPane extends React.Component<StoreProps> {
    private key = 0
    state = {
        range: [3, 6]
    }

    render(): JSX.Element {
        return (
            <div style={{padding: 50, overflow: 'hidden', position: 'relative', top: 0, left: 0, right: 0, bottom: 0}}>
                <Box sx={{ display: 'flex' }}>
                    <FormControl component="fieldset" variant="standard">
                        <FormLabel component="legend">Include Data from years</FormLabel>
                        <FormGroup key={1}>
                            {this.years}
                            {this.slider}
                            {this.gender}
                            {this.abilities}
                        </FormGroup>
                    </FormControl>
                </Box>
            </div>
        )
    }

    get years(): JSX.Element {
        const config = this.props.controlStore!
        const selectableYears = []
        for (let i = 2011; i < 2022; i++) {
            selectableYears.push(i.toString())
        }
        const yearOption = selectableYears.map((year: string) => {
            const yearSelected = config.controlState.selectedYears[parseInt(year)]
            return <FormControlLabel key={this.key++} control={<Checkbox name={year} defaultChecked={yearSelected} onChange={this.handleChanges.bind(this)}/>} label={year} />
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
                .map(([k, v]) => k as string +  ' (' + v + ')')
        // debugger
        return (<Autocomplete
            multiple
            id="checkboxes-tags-demo"
            options={filterdValues}
            disableCloseOnSelect
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
                <TextField {...params} label="Tools and Technologies" placeholder="SQL, Java, etc." />
            )}
        />)
    }

    get slider(): any {
        return (
            <div>
                <FormLabel component="legend">Years of Expirience</FormLabel>
                <Slider
                    style={{ width: '90%', minWidth: '200px' }}
                    value={this.state.range}
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
            </div>
        )
    }
    
    get gender(): any {
        const values = this.props.entryStore!.currentConfig.gender
        return this.getCheckboxesForValues(values, Gender, 'Gender')
    }

    getGenderForValue(gender: Gender): any {
        const selectedGenders = this.props.entryStore!.currentConfig.gender
        return (
            <FormControlLabel control={<Checkbox defaultChecked={selectedGenders.find(selected => selected === gender) != null} />} label={gender} />
        )
    }

    // TODO: Get General generator for checkbox, slider, dropdown (company size)
    // Add generic header for: collapsible, active, weight
    // TODO: Replace any with Enum.class
    getCheckboxesForValues<T>(selectedValues: T[], enumClass: any, title: string): any {
        // Get enum values of typescript: https://stackoverflow.com/a/48768775/8524651
        const values = Object.keys(enumClass).filter((item) => {
            return isNaN(Number(item))
        })
        const checkboxes = values.map(value => {
            // TODO: How to get values
            const check = selectedValues.find(selected => (selected as any).toString() === value) != null
            return (
                <FormControlLabel key={this.key++} control={<Checkbox defaultChecked={check} />} label={value} />
            )
        })
        return (
            <div>
                <FormLabel component="legend">{title}</FormLabel>
                {checkboxes}
            </div>
        )
    }

    handleChange(event: ChangeEvent<any>, value: number | number[]): void {
        this.setState({range: value as number[]})
    }

    // https://stackoverflow.com/a/43746799/8524651
    private handleChanges(event: any, newValue: any): void {
        event.persist() // allow native event access (see: https://facebook.github.io/react/docs/events.html)
        this.props.controlStore!.setControlStateValue(event.target.name, newValue)
    }

}

export default inject(...injectClause)(observer(ControlPane))