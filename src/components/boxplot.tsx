import React from 'react'
import Plot from 'react-plotly.js'
import { Data, Layout } from 'plotly.js'
import { inject, observer } from 'mobx-react'
import SurveyEntry from '../model/surveyEntry'
import { injectClause, StoreProps } from '../stores/storeHelper'

class BoxPlot extends React.Component<StoreProps> {

    defaultBoxConfig: Partial<Data> = {
        type: 'box',
        boxmean: 'sd',
        // boxpoints: 'all',
        // jitter: 0.3,
        // pointpos: -1.8
    }

    render(): JSX.Element {
        /*
                <div>
                    {this.getLoader()}
                </div>
        */
        return (
            <div style={{position: 'absolute', top: 0, bottom: 0, left:0, right: 0, overflow: 'auto'}}>
                 <Plot
                     data={this.data}
                     layout={this.layout}
                     style={{width: '100%', height: '100%'}}
                 />
            </div>
        )
    }

    private get data(): Data[] { // TODO: Plotty Data
        const resultList = this.props.uiStore!.filteredData
        const selectedYearStr = this.props.controlStore!.controlState.selectedYear
        const selectedYearNum = parseInt(selectedYearStr, 10)

        // Get the data for the selected year
        const yearData = resultList[selectedYearNum]

        if (!yearData) {
            return []   // no data for the selected year
        }

        const trace: Data = {
            type: 'box',
            boxmean: 'sd',
            x: [selectedYearStr],
            name: selectedYearStr,
            y: yearData.map((entry: SurveyEntry)  => entry.salary),
        };
        return [trace];
    }

    get layout(): Partial<Layout> {
        return {
            autosize: true,
            title: '',
            showlegend: false,
            yaxis: {fixedrange: true},
            xaxis : {fixedrange: true},
            paper_bgcolor: '#FF000000',
            plot_bgcolor: '#FF000000'
        }
    }
}

export default inject(...injectClause)(observer(BoxPlot))