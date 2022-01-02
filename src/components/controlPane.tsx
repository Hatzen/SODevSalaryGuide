import React, { ChangeEvent } from "react";
import Store from "../model/Store";
import { Checkbox, FormGroup, FormControl, FormControlLabel, Grid, Slider } from '@material-ui/core';
import DefaultConfig from "../model/defaultConfig";


export default class ControlPane extends React.Component {
    /*state: any = React.useState({
        gilad: true,
        jason: false,
        antoine: false,
      });*/

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
                                style={{ width: '500px' }}
                                value={[3,6]}
                                min={0}
                                step={1}
                                max={40}
                                // valueLabelFormat={numFormatter}
                                // marks={followersMarks}
                                // scale={scaleValues}
                                onChange={this.handleChange}
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

    handleChange(event: ChangeEvent<{}>) : void {

    }

    private get data(): any {
        return Object.keys(Store.parsedDataByYear)
            .map(key =>{
                return {
                    x: key,
                    name: key,
                    y: Store.parsedDataByYear[key as any].map(i => i.salary),
                    type: 'box',
                    boxmean: 'sd',
                    // boxpoints: 'all',
                    // jitter: 0.3,
                    // pointpos: -1.8
                }
            })
            // TODO: xAxis is not set properly and would lead to problems only one point is shown..
            .concat([{
                    x: '>2011',
                    name: '2009',
                    y: Store.parsedData.map(i => i.salary),
                    type: 'box',
                    boxmean: 'sd',
                    // boxpoints: 'all',
                    // jitter: 0.3,
                    // pointpos: -1.8
                }
            ])
    }
  }