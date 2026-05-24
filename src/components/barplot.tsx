import React from 'react'
import Plot from 'react-plotly.js'
import { inject, observer } from 'mobx-react'
import { injectClause, StoreProps } from '../stores/storeHelper'

class BarPlot extends React.Component<StoreProps> {

    render(): JSX.Element {
        return (
            <div style={{position: 'absolute', top: 0, bottom: 0, left:0, right: 0, overflow: 'auto'}}>
                <Plot
                    data={this.data}
                    layout={{barmode: 'group', title: '', showlegend: false}}
                    style={{width: '100%', height: '100%'}}
                    responsive={true}
                // TODO: Check Layout.template
                // TODO: Check Config.static for temporary disable?
                />
            </div>
        )
    }

    private get data(): Array<Record<string, unknown>> { // TODO: Plotty Data
        const resultList = this.props.entryStore!.parsedDataByYear
        const filteredList = this.props.uiStore!.filteredData

        const displayYears = this.props.controlStore!.controlState.selectedYears

        const overallNumbers = Object.keys(resultList)
            .filter(year => displayYears[parseInt(year, 10)] === true)
            .map(key => resultList[parseInt(key, 10)].overallEntryCount)
             
        const invalidNumbers = Object.keys(resultList)
            .filter(year => displayYears[parseInt(year, 10)] === true)
            .map(key => resultList[parseInt(key, 10)].invalidEntryCount)

        const matchingFilterNumbers = Object.keys(filteredList)
            .filter(year => displayYears[parseInt(year, 10)] === true)
            .map(key => filteredList[parseInt(key, 10)].length)
       
        const traces: Array<Record<string, unknown>> = [
            { y: matchingFilterNumbers, name: 'matching filter', type: 'bar' },
            { y: overallNumbers, name: 'allParticipations', type: 'bar' },
            { y: invalidNumbers, name: 'considered invalid', type: 'bar' },
        ]
        return traces
    }
}

export default inject(...injectClause)(observer(BarPlot))
