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
    }
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
        const resultList = this.props.uiStore!.filteredData
        const selectedYearStr = this.props.controlStore!.controlState.selectedYear
        const selectedYearNum = parseInt(selectedYearStr, 10)

        const yearData = resultList[selectedYearNum]

        if (!yearData) {
            return []
        }

        const trace: Data = {
            type: 'box',
            boxmean: 'sd',
            name: 'Year ' + selectedYearStr,
            y: yearData.map((entry: SurveyEntry)  => entry.salary),
        }
        return [trace]
    }

    get layout(): Partial<Layout> {
        return {
            autosize: true,
            showlegend: false,
            yaxis: {fixedrange: true},
            xaxis : {fixedrange: true},
            paper_bgcolor: '#FF000000',
            plot_bgcolor: '#FF000000',
        }
    }
}

export default inject(...injectClause)(observer(BoxPlot))