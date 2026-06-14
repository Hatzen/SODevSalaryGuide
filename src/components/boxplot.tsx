import React from 'react'
import Plot from 'react-plotly.js'
import { Data, Layout } from 'plotly.js'
import { inject, observer } from 'mobx-react'
import SurveyEntry from '../model/surveyEntry'
import { injectClause, StoreProps } from '../stores/storeHelper'

// 1. Explicitly type the exact signature of Plotly's internal Fx module
interface PlotlyFxModule {
    hover: (
        element: HTMLElement,
        targets: Array<{ curveNumber: number; pointNumber: number }>
    ) => void;
}

class BoxPlot extends React.Component<StoreProps> {

    defaultBoxConfig: Partial<Data> = {
        type: 'box',
        boxmean: 'sd',
    }
    
    // Track the explicit plot DOM layout natively
    private chartElement: HTMLElement | null = null

    render(): JSX.Element {
        return (
            <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, overflow: 'auto' }}>
                <Plot
                    data={this.data}
                    layout={this.layout}
                    style={{ width: '100%', height: '100%' }}
                    useResizeHandler={true}
                    onInitialized={this.handleInit}
                    onUpdate={this.handleUpdate}
                />
            </div>
        )
    }

    // 2. Capture the actual DOM Node element from the React-Plotly lifecycles
    handleInit = (_figure: unknown, graphDiv: Readonly<HTMLElement>): void => {
        this.chartElement = graphDiv as HTMLElement
        this.triggerHoverEvent()
    }

    handleUpdate = (_figure: unknown, graphDiv: Readonly<HTMLElement>): void => {
        this.chartElement = graphDiv as HTMLElement
        this.triggerHoverEvent()
    }

    private triggerHoverEvent = (): void => {
        if (!this.chartElement) return

        // 3. Resolve the runtime Plotly instance from the window namespace or internal component scope
        const globalPlotly = (window as any).Plotly as Record<string, unknown> | undefined
        
        if (globalPlotly && 'Fx' in globalPlotly) {
            const Fx = globalPlotly.Fx as PlotlyFxModule
            
            // Push calculation execution onto the microtask queue to wait for the canvas layer to completely draw
            setTimeout(() => {
                if (this.chartElement) {
                    Fx.hover(this.chartElement, [
                        { curveNumber: 0, pointNumber: 0 }
                    ])
                }
            }, 0)
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
            marker: {
                color: '#F48024'
            },
            y: yearData.map((entry: SurveyEntry) => entry.salary),
        }
        return [trace]
    }

    get layout(): Partial<Layout> {
        return {
            autosize: true,
            showlegend: false,
            hovermode: 'closest',
            yaxis: { fixedrange: true },
            xaxis: { fixedrange: true },
            paper_bgcolor: '#FF000000',
            plot_bgcolor: '#FF000000',
        }
    }
}

export default inject(...injectClause)(observer(BoxPlot))