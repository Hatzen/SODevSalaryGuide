import React from "react";
import Store from "../model/Store";
import { Checkbox, FormGroup, FormControl, FormControlLabel, Grid } from '@material-ui/core';


export default class ControlPane extends React.Component {
    /*state: any = React.useState({
        gilad: true,
        jason: false,
        antoine: false,
      });*/

    render() {
        return (
            <div style={{padding: 50, position: 'relative', top: 0, left: 0, right: 0, bottom: 0}}>
                <FormControl aria-colcount={2} component="fieldset" variant="standard">
                <FormGroup >
                    <Grid container>
                        <Grid item xs={2}>
                            <FormControlLabel control={<Checkbox defaultChecked />} label="2011" />
                            <FormControlLabel control={<Checkbox defaultChecked />} label="2012" />
                            <FormControlLabel control={<Checkbox defaultChecked />} label="2013" />
                            <FormControlLabel control={<Checkbox defaultChecked />} label="2014" />
                            <FormControlLabel control={<Checkbox defaultChecked />} label="2015" />
                            <FormControlLabel control={<Checkbox defaultChecked />} label="2016" />
                        </Grid>
                        <Grid item xs={2}>
                            <FormControlLabel control={<Checkbox defaultChecked />} label="2017" />
                            <FormControlLabel control={<Checkbox defaultChecked />} label="2018" />
                            <FormControlLabel control={<Checkbox defaultChecked />} label="2019" />
                            <FormControlLabel control={<Checkbox defaultChecked />} label="2020" />
                            <FormControlLabel control={<Checkbox defaultChecked />} label="2021" />
                        </Grid>
                    </Grid>
                </FormGroup>
                </FormControl>
                
            </div>
            
            );
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