import React from 'react'
import Plot from 'react-plotly.js'
import { Data, Layout } from 'plotly.js'
import { inject, observer } from 'mobx-react'
import { injectClause, StoreProps } from '../stores/storeHelper'

class BarPlot extends React.Component<StoreProps> {

    plotRef: React.RefObject<HTMLDivElement>

    constructor(props: StoreProps) {
        super(props)
        this.plotRef = React.createRef()
    }

    render(): JSX.Element {
        return (
            <div ref={this.plotRef} style={{position: 'absolute', top: 0, bottom: 0, left:0, right: 0, overflow: 'auto'}}>
                <Plot
                    data={this.data}
                    layout={this.layout}
                    style={{width: '100%', height: '100%'}}
                    onInitialized={this.handleInit}
                    onUpdate={this.handleResize}
                />
            </div>
        )
    }

    componentDidUpdate(): void {
        this.handleResize()
    }

    handleInit = (): void => {
        setTimeout(this.handleResize, 0)
    }

    handleResize = (): void => {
        if (this.plotRef.current) {
            const plotlyEl = this.plotRef.current.querySelector('.js-plotly-plot') as HTMLElement & { Plotly?: { relayout: (el: HTMLElement, layout: Partial<Layout>) => void } }
            if (plotlyEl && plotlyEl.Plotly) {
                plotlyEl.Plotly.relayout(plotlyEl, { autosize: true })
            }
        }
    }

    private get data(): Data[] {
        const selectedYearStr = this.props.controlStore!.controlState.selectedYear
        const selectedYearNum = parseInt(selectedYearStr, 10)

        const resultList = this.props.entryStore!.parsedDataByYear
        const filteredList = this.props.uiStore!.filteredData

        const yearEntrySet = resultList[selectedYearNum]
        const filteredYearList = filteredList[selectedYearNum]

        if (!yearEntrySet || !filteredYearList) {
            return []
        }

        const overallNumbers = [yearEntrySet.overallEntryCount]
        const invalidNumbers = [yearEntrySet.invalidEntryCount]
        const matchingFilterNumbers = [filteredYearList.length]

return [
            {
                y: matchingFilterNumbers,
                name: 'matching filter',
                type: 'bar',
                marker: { color: '#F48024' }  // Use primary orange from theme
            },
            {
                y: overallNumbers,
                name: 'allParticipations',
                type: 'bar',
                marker: { color: '#E3E6E8' }  // Use secondary gray from theme
            },
            {
                y: invalidNumbers,
                name: 'considered invalid',
                type: 'bar',
                marker: { color: '#FF6B6B' }  // Use error red
            }
        ]
    }
    
    get layout(): Partial<Layout> {
        return {
            barmode: 'group',
            showlegend: true,
            paper_bgcolor: '#FF000000',
            plot_bgcolor: '#FF000000',
        }
    }
}

export default inject(...injectClause)(observer(BarPlot))