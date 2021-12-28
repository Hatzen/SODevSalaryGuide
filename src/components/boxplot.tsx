import React from "react";
import Plot, { PlotParams } from "react-plotly.js";
import Storage from "../model/storage";

export class BoxPlotParam {
    storage!: Storage
}

export default class BoxPlot extends React.Component<BoxPlotParam> {

    storage!: Storage

    constructor(props: any, context: any) {
        super(props, context)
        this.storage = this.props.storage
    }

    render() {
        return (
            <Plot
                data={this.data}
                layout={ {width: 1000, height: 1000, title: 'A Fancy Plot'} }
            />
            );
    }

    private get data(): any {
        debugger
        return Object.keys(this.storage.parsedDataByYear)
            .map(key =>{
                return {
                    x: key,
                    y: this.storage.parsedDataByYear[key as any].map(i => i.salary),
                    type: 'box',
                    boxmean: 'sd',
                    boxpoints: 'all',
                    jitter: 0.3,
                    pointpos: -1.8
                }
            })
            // TODO: xAxis is not set properly and would lead to problems only one point is shown..
            .concat([{
                    x: 'United years',
                    y: this.storage.parsedData.map(i => i.salary),
                    type: 'box',
                    boxmean: 'sd',
                    boxpoints: 'all',
                    jitter: 0.3,
                    pointpos: -1.8
                }
            ])
    }
  }