import React from "react";
import Plot from "react-plotly.js";
import Storage from "../model/storage";

export class BoxPlotParam {
    storage!: Storage
}

export default class BoxPlot extends React.Component<BoxPlotParam> {

    storage!: Storage

    render() {
        console.error("size of yValues " + this.yValues.length)
        return (
            <Plot
                data={[
                {
                    y: this.yValues,
                    type: 'box',
                    boxmean: 'sd',
                    marker: {color: 'red'},
                }
                ]}
                layout={ {width: 1000, height: 1000, title: 'A Fancy Plot'} }
            />
            );
    }

    private get yValues () {
        return this.storage.parsedData.map(i => i.salary)
    }

    private get xValues () {
        let count = 0
        return this.storage.parsedData.map(i => count++)
    }
  }