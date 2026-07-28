import React from 'react'
import Plot from 'react-plotly.js'
import { Data, Layout } from 'plotly.js'
import { inject, observer } from 'mobx-react'
import { injectClause, StoreProps } from '../stores/storeHelper'
import translationStore from '../stores/translationStore'
import IconButton from '@mui/material/IconButton'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import StatisticsModal from './statisticsModal'

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

    state = {
        statsModalOpen: false
    }
    
    // Track the explicit plot DOM layout natively
    private chartElement: HTMLElement | null = null

    render(): JSX.Element {
        const isMobile = this.props.uiStore!.isMobileView
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
                <div style={{ position: 'absolute', top: '10px', left: '10px', backgroundColor: 'rgba(255,255,255,0.9)', padding: '8px 12px', borderRadius: '4px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>{this.statisticsHint}</span>
                    <IconButton
                        size="small"
                        onClick={() => this.setState({ statsModalOpen: true })}
                        aria-label={translationStore.t.statisticsHelp}
                        style={{ color: '#F48024', padding: 2 }}
                    >
                        <HelpOutlineIcon fontSize="small" />
                    </IconButton>
                </div>
                <StatisticsModal
                    open={this.state.statsModalOpen}
                    onClose={() => this.setState({ statsModalOpen: false })}
                    fullScreen={isMobile}
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
        const stats = this.props.uiStore!.boxStats
        const selectedYearStr = this.props.controlStore!.controlState.selectedYear

        if (!stats || stats.count === 0) {
            return []
        }

        // Precomputed box from the incremental streaming statistics (keeps RAM low)
        const trace: Data = {
            type: 'box',
            boxmean: 'sd',
            name: 'Year ' + selectedYearStr,
            marker: {
                color: '#F48024'
            },
            q1: [stats.q1],
            median: [stats.median],
            q3: [stats.q3],
            lowerfence: [stats.lowerFence],
            upperfence: [stats.upperFence],
            mean: [stats.mean],
            sd: [stats.std],
            hovertemplate: 'Median: %{median}<br>Mean: %{mean}<br>Std: %{sd}<extra></extra>'
        } as unknown as Data
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

    private get statisticsHint(): string {
        const t = translationStore.t
        const stats = this.props.uiStore!.boxStats
        const selectedCurrency = this.props.controlStore!.controlState.selectedCurrency

        if (!stats || stats.count === 0) return t.noDataAvailable

        return `${t.medianLabel}: ${Math.round(stats.median).toLocaleString()} ${selectedCurrency} | ${t.meanLabel}: ${Math.round(stats.mean).toLocaleString()} ${selectedCurrency} | ${t.stdLabel}: ${Math.round(stats.std).toLocaleString()} ${selectedCurrency}`
    }
}

export default inject(...injectClause)(observer(BoxPlot))