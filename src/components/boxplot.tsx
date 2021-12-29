import React from "react";
import Plot, { PlotParams } from "react-plotly.js";
import Store from "../model/Store";

export default class BoxPlot extends React.Component {

    componentDidMount() {
    }

    render() {
        return (
            <Plot
                data={this.data}
                layout={ {width: 2000, height: 1000, title: ''} }
            />
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