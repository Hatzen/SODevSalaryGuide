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
                     layout={{barmode: 'group', showlegend: false}}
                     style={{width: '100%', height: '100%'}}
                 />
            </div>
        )
    }

    private get data(): Array<Record<string, unknown>> { // TODO: Plotty Data
        const selectedYearStr = this.props.controlStore!.controlState.selectedYear;
        const selectedYearNum = parseInt(selectedYearStr, 10);

        const resultList = this.props.entryStore!.parsedDataByYear;
        const filteredList = this.props.uiStore!.filteredData;

        // Get the data for the selected year from entryStore.parsedDataByYear (by number key)
        const yearEntrySet = resultList[selectedYearNum];
        // Get the data for the selected year from uiStore.filteredData (by string key)
        const filteredYearList = filteredList[selectedYearNum];

        // If we don't have data for the selected year, return empty traces?
        if (!yearEntrySet || !filteredYearList) {
            return [];
        }

        const overallNumbers = [yearEntrySet.overallEntryCount];
        const invalidNumbers = [yearEntrySet.invalidEntryCount];
        const matchingFilterNumbers = [filteredYearList.length];

        const traces: Array<Record<string, unknown>> = [
            { y: matchingFilterNumbers, name: 'matching filter', type: 'bar' },
            { y: overallNumbers, name: 'allParticipations', type: 'bar' },
            { y: invalidNumbers, name: 'considered invalid', type: 'bar' },
        ];
        return traces;
    }
}

export default inject(...injectClause)(observer(BarPlot))
