import React from 'react'
import Plot from 'react-plotly.js'
import { inject, observer } from 'mobx-react'
import { injectClause, StoreProps } from '../stores/storeHelper'

class BarPlot extends React.Component<StoreProps> {

    render(): JSX.Element {
        return (
            <div style={{background: 'rgba(52, 52, 52, 0.8)', zIndex:1000, padding: 'auto',
                position: 'absolute', top: 0, left: 0, right:0, bottom: 0}}>
                <div style={{position: 'absolute', top: 0, bottom: 0, left:0, right: 0, overflow: 'auto'}}>
                    <Plot
                        data={this.data}
                        layout={ {barmode: 'group', width: this.width, height: this.height, title: '', showlegend: false} }
                    // TODO: Check Layout.template
                    // TODO: Check Config.static for temporary disable?
                    />
                </div>
            </div>
        )
    }

    private get data(): any { // TODO: Plotty Data
        const resultList = this.props.entryStore!.parsedDataByYear
        
        const displayYears = this.props.controlStore?.controlState.selectedYears

        const invalidNumbers = Object.keys(resultList)
            .filter(year => displayYears![year as any] === true)
            .map(key => resultList[key as any].invalidEntryCount)

        const overallNumbers = Object.keys(resultList)
            .filter(year => displayYears![year as any] === true)
            .map(key => resultList[key as any].overallEntryCount)


        const trace1 = {
            x: displayYears,
            y: overallNumbers,
            name: 'allParticipations',
            type: 'bar'
        }
      
        const trace2 = {
            x: displayYears,
            y: invalidNumbers,
            name: 'considered invalid',
            type: 'bar'
        }
      
        return [trace1, trace2]
    }

    get width(): number {
        return window.innerWidth * 0.8
    }
    
    get height(): number {
        return window.document.documentElement.clientHeight
    }
}

export default inject(...injectClause)(observer(BarPlot))