import React, { MutableRefObject, useRef } from 'react'
import Plot, { Figure } from 'react-plotly.js'
import { Data, Layout, PlotData, PlotlyHTMLElement } from 'plotly.js'
import { inject, observer } from 'mobx-react'
import SurveyEntry from '../model/surveyEntry'
import { injectClause, StoreProps } from '../stores/storeHelper'
// Define the shape of the figure argument passed by react-plotly.js
/*interface PlotlyFigure {
  data: PlotData[];
  layout: Partial<Layout>;
  frames: any[] | null;
}*/
 
class BoxPlot extends React.Component<StoreProps> {


    defaultBoxConfig: Partial<Data> = {
        type: 'box',
        boxmean: 'sd',
        // boxpoints: 'all',
        // jitter: 0.3,
        // pointpos: -1.8
    }
  // Create a reference to store the plot instance
   //plotRef: MutableRefObject<HTMLElement | null> = useRef(null);


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

    /*
    render(): JSX.Element {
        return (
            <div style={{position: 'absolute', top: 0, bottom: 0, left:0, right: 0, overflow: 'auto'}}>
                 <Plot
                     data={this.data}
                     layout={this.layout}
                     style={{width: '100%', height: '100%'}}
                    // Store reference and trigger hover when first loaded
                        onInitialized={this.initializ}
                        // Re-trigger hover if the plot layout updates or resizes
                        onUpdate={this.update}
                        // Re-trigger hover when user moves mouse away
                        onUnhover={this.unhover}

                 />
            </div>
        )
    }
    
    pinBoxHover(plotElement: HTMLElement | null): void {
        // Cast window or element to access Fx API safely in TypeScript
        const plotlyModule = (window as any).Plotly || (plotElement as any)?.Plotly;
        
        if (plotElement && plotlyModule) {
        plotlyModule.Fx.hover(plotElement, [
            { curveNumber: 0, pointNumber: 0 }
        ]);
        }

    };

    initializ(figure: Readonly<Figure>, graphDiv: Readonly<HTMLElement>): void {
        this.plotRef.current = graphDiv;
        this.pinBoxHover(graphDiv);
    }

    update(figure: Readonly<Figure>): void {
        this.pinBoxHover(this.plotRef.current);
    }

    unhover(): void {
        this.pinBoxHover(this.plotRef.current);
    }*/
                        

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
            name: 'Year ' + selectedYearStr,
            y: yearData.map((entry: SurveyEntry)  => entry.salary),
        };
        return [trace];
    }

    get layout(): Partial<Layout> {
        return {
            autosize: true,
            showlegend: false,
            // 'x' mode forces plotly to show the summary statistics for the column on that X coordinate
            // hovermode: 'x',
            //hovermode: 'closest',
            yaxis: {fixedrange: true},
            xaxis : {fixedrange: true},
            paper_bgcolor: '#FF000000',
            plot_bgcolor: '#FF000000',
            // hoverdistance: -1
        }
    }
}

export default inject(...injectClause)(observer(BoxPlot))