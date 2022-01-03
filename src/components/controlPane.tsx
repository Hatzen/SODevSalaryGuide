import React, { ChangeEvent, useState } from "react";
import { StoreProps } from "../model/Store";
import { Checkbox, FormGroup, FormControl, FormControlLabel, Grid, Slider } from '@material-ui/core';
import DefaultConfig from "../model/defaultConfig";
import { inject, observer } from "mobx-react";

class ControlPane extends React.Component<StoreProps> {
    state = {
        range: [3, 6]
    }

    render() {
        const yearOption = new DefaultConfig().selectedYears.map((year: string) => 
            <FormControlLabel control={<Checkbox defaultChecked />} label={year} />)

        return (
            <div style={{padding: 50, overflowX: 'auto', position: 'relative', top: 0, left: 0, right: 0, bottom: 0}}>
                <FormControl aria-colcount={2} component="fieldset" variant="standard">
                <FormGroup>
                    <Grid container
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

                    <Grid container
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                        style={{width: '100%'}}
                        >
                        <Grid item >
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
                        </Grid>
                    </Grid>
                </FormGroup>
                </FormControl>
            </div>
            );
    }

    handleChange(event: ChangeEvent<{}>, value: number | number[]) : void {
        this.setState({range: value as number[]})
    }

}

export default inject('entryStore')(observer(ControlPane))