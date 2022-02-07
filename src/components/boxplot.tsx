import React from 'react'
import Plot from 'react-plotly.js'
import { inject, observer } from 'mobx-react'
import SurveyEntry from '../model/surveyEntry'
import { injectClause, StoreProps } from '../stores/storeHelper'
import { Layout } from 'plotly.js'

class BoxPlot extends React.Component<StoreProps> {

    defaultBoxConfig: Partial<Plotly.Data> = {
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
                // TODO: Check Layout.template
                // TODO: Check Config.static for temporary disable?
                />
            </div>
        )
    }

    private get data(): any { // TODO: Plotty Data
        const resultList = this.props.uiStore!.filteredData
        const allData = this.props.entryStore!.parsedData

        const displayYears = this.props.controlStore?.controlState.selectedYears

        return Object.keys(resultList)
            .filter(year => displayYears![year as any] === true)
            .map(key =>{
                return {
                    x: key,
                    name: key,
                    y: resultList[key as any].map((entry: SurveyEntry)  => entry.salary),
                    ...this.defaultBoxConfig
                }
            })
            // TODO: xAxis is not set properly and would lead to problems only one point is shown..
            .concat([{
                x: 2009 as any, // TODO: Somehow label correctly as overall values..
                name: 2009 as any,
                y: allData.resultSet.map((entry: SurveyEntry) => entry.salary),
                ...this.defaultBoxConfig
            }
            ])
    }

    get layout(): Partial<Layout> {
        return {
            autosize: false,
            width: this.width,
            height: this.height,
            title: '',
            showlegend: false,
            yaxis: {fixedrange: true},
            xaxis : {fixedrange: true},
            paper_bgcolor: '#FF000000',
            plot_bgcolor: '#FF000000'
        }
    }

    get width(): number {
        return window.innerWidth * 0.8 - 50
    }
    
    get height(): number {
        const appBarHeight = 100
        const diagramSelectionHeight = 50
        return window.document.documentElement.clientHeight - (appBarHeight + diagramSelectionHeight)
    }
}

export default inject(...injectClause)(observer(BoxPlot))