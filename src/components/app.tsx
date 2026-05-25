import React from 'react'
import entryStore from '../stores/entryStore'
import BoxPlot from './boxplot'
import BarPlot from './barplot'
import { Allotment, AllotmentHandle } from 'allotment'
import 'allotment/dist/style.css'
import ControlPane from './controlPane'
import DisclaimerModal from './disclaimerModal'
import MenuAppBar from './appBar'
import { Provider } from 'mobx-react'
import controlStore from '../stores/controlStore'
import { Tab, Tabs } from '@material-ui/core'
import { UiStore } from '../stores/uiStore'
import { StoreProps } from '../stores/storeHelper'
import SurveyEntry from '../model/surveyEntry'

interface AppState {
    components: number[],
    usePlot: number
}

class App extends React.Component<any, AppState> {
    private controlPane: React.RefObject<AllotmentHandle>
    private uiStore: UiStore
    
    constructor(props: any) {
        super(props)
        this.controlPane = React.createRef()
        this.state ={
            components: [0, 1],
            usePlot: 0
        }
        // Store must be created only once.
        this.uiStore = new UiStore(controlStore, entryStore)
        SurveyEntry.entryStore = entryStore
    }

    render(): JSX.Element {
        const fitAll = {position: 'absolute' as any, top:0, left:0, bottom: 0, right:0}
        const stores: StoreProps = {
            entryStore,
            controlStore,
            uiStore: this.uiStore
        }

        const panes = this.state.components

        return (
            <div style={fitAll}>
                <Provider {...stores}>
                    <DisclaimerModal fullScreen={false}></DisclaimerModal>
                    <MenuAppBar menuClicked={this.toggleControls.bind(this)}>
                    </MenuAppBar>
                    <div style={{position: 'absolute', top: 64, bottom: 0, left: 0, right:0}}>
                        <Allotment ref={this.controlPane}>
                            {panes.map((pane: number) => {
                                if (pane === 0) {
                                    return (
                                        <Allotment.Pane key={pane}>
                                            <div style={{position: 'relative', top: 0, left: 0, right: 0}} >
                                                <Tabs
                                                    value={''}
                                                    onChange={this.changePlot.bind(this)}>
                                                    <Tab label="Salary" />
                                                    <Tab label="Participation" />
                                                </Tabs>
                                            </div>
                                            <div style={{position: 'relative', top: 0, left: 0, right: 0, height: 'calc(100% - 48px)'}}>
                                                {this.state.usePlot === 0 ? <BoxPlot></BoxPlot> : <BarPlot></BarPlot>}
                                            </div>
                                        </Allotment.Pane>
                                    )
                                } else {
                                    return (
                                        <Allotment.Pane  key={pane} snap maxSize={400}>
                                            <ControlPane></ControlPane>
                                        </Allotment.Pane>
                                    )
                                }
                            })}
                        </Allotment>
                    </div>
                </Provider>
            </div>
        )
    }

    private changePlot(): void {
        let showPlot: number
        if (this.state.usePlot === 1) {
            showPlot = 0
        } else {
            showPlot = 1
        }
        this.setState({usePlot: showPlot})
    }

    private toggleControls(): void {
        if ((this.state as any).components.length === 1) {
            this.setState({
                components: [0 ,1]
            })
            this.controlPane.current!.reset()
        } else {
            this.setState({
                components: [0]
            })
        }
    }
    
}

export default App
