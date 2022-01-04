import React from 'react'
import Plot from 'react-plotly.js'
import { StoreProps } from '../model/store'
import Loader from 'react-loader-spinner'
import { inject, observer } from 'mobx-react'

class BoxPlot extends React.Component<StoreProps> {

    defaultBoxConfig: Partial<Plotly.Data> = {
        type: 'box',
        boxmean: 'sd',
        // boxpoints: 'all',
        // jitter: 0.3,
        // pointpos: -1.8
    }

    render(): JSX.Element {
        return (
            <div style={{background: 'rgba(52, 52, 52, 0.8)', zIndex:1000, padding: 'auto',
                position: 'absolute', top: 0, left: 0, right:0, bottom: 0}}>
                <div>
                getLoader()
                </div>
                <div style={{position: 'absolute', top: 0, bottom: 0, left:0, right: 0, overflow: 'auto'}}>
                    <Plot
                        data={this.data}
                        layout={ {width: this.width, height: this.height, title: '', showlegend: false} }
                    // TODO: Check Layout.template
                    // TODO: Check Config.static for temporary disable?
                    />
                </div>
            </div>
        )
    }

    getLoader(): JSX.Element {
        return (
            <div style={{position: 'relative',
                top: 'calc(50% - 75px)',
                bottom: 'calc(50% - 75px)',
                left: 'calc(50% - 75px)',
                right: 'calc(50% - 75px)'
            }}>
                <Loader
                    type="Audio"
                    color="#993300"
                    height={150}
                    width={150}
                    secondaryColor="#000000" />
            </div>
        )
    }

    private get data(): any {
        // TODO: This makes it responsive.. But why not changes of parsedDataByYear which occure...
        const test = this.props.entryStore!.lastUpdatedYear
        if (test != null) {
            console.log('triggered')
        }
        // Remove above..

        const resultList = this.props.entryStore!.parsedDataByYear
        const allData = this.props.entryStore!.parsedData

        return Object.keys(resultList)
            .map(key =>{
                return {
                    x: key,
                    name: key,
                    y: resultList[key as any].resultSet.map(i => i.salary),
                    ...this.defaultBoxConfig
                }
            })
            // TODO: xAxis is not set properly and would lead to problems only one point is shown..
            .concat([{
                x: '>2011',
                name: '2009',
                y: allData.resultSet.map(i => i.salary),
                ...this.defaultBoxConfig
            }
            ])
    }

    get width(): number {
        return window.innerWidth * 0.8
    }
    
    get height(): number {
        return window.document.documentElement.clientHeight
    }
}

export default inject('entryStore')(observer(BoxPlot))