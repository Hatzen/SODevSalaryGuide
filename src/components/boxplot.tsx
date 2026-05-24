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
        const allData = this.props.entryStore!.parsedData

        const displayYears = this.props.controlStore!.controlState.selectedYear

        return Object.keys(resultList)
            .filter(year => displayYears == year)
            .map(key => {
                return {
                    ...this.defaultBoxConfig,
                    x: [key],
                    name: key,
                    y: resultList[parseInt(key, 10)].map((entry: SurveyEntry)  => entry.salary),
                }
            })
            // TODO: xAxis is not set properly and would lead to problems only one point is shown..
            .concat([{
                ...this.defaultBoxConfig,
                x: ['2009'], // TODO: Somehow label correctly as overall values..
                name: '2009',
                y: allData.resultSet.map((entry: SurveyEntry) => entry.salary),
            }
            ])
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