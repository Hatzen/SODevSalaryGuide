import React from "react";
import Plot, { PlotParams } from "react-plotly.js";
import Store from "../model/Store";
import Loader from "react-loader-spinner";

export default class BoxPlot extends React.Component {

    render() {
        return (
            <div>
                <div style={{background: 'rgba(52, 52, 52, 0.8)', zIndex:1000, padding: 'auto',
                position: 'absolute', top: 0, left: 0, right:0, bottom: 0}}>
                <div style={{position: 'relative', 
                    top: 'calc(50% - 75px)', 
                    bottom: 'calc(50% - 75px)', 
                    left: 'calc(50% - 75px)', 
                    right: 'calc(50% - 75px)'
                    }}>
                <Loader
                    type="Audio"
                    color="#993300"
                    height={150}
                    width={150}
                    secondaryColor="#000000"
                /></div>
            </div>
            <div style={{position: 'absolute', top: 0, bottom: 0, left:0, right: 0, overflow: 'scroll'}}>
                <Plot
                    data={this.data}
                    layout={ {width: 2000, height: 1000, title: ''} }
                />
            </div>
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