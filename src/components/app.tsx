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

class App extends React.Component<Record<string, unknown>, AppState> {
    private controlPane: React.RefObject<AllotmentHandle>
    private uiStore: UiStore
    
    constructor() {
        super({})
        this.controlPane = React.createRef<AllotmentHandle>()
        this.state ={
            components: [0, 1],
            usePlot: 0
        }
        // Store must be created only once.
        this.uiStore = new UiStore(controlStore, entryStore)
        SurveyEntry.entryStore = entryStore
    }

    render(): JSX.Element {
        const fitAll: React.CSSProperties = {position: 'absolute', top:0, left:0, bottom: 0, right:0}
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
                                                     value={this.state.usePlot}
                                                     onChange={this.changePlot}>
                                                     <Tab label="Salary" />
                                                     <Tab label="Participation" />
                                                 </Tabs>
                                             </div>
                                             <div style={{position: 'relative', top: 0, left: 0, right: 0, height: 'calc(100% - 48px)', width: '100%'}}>
                                                 <div style={{width: '100%', height: '100%'}}>
                                                     {this.state.usePlot === 0 ? <BoxPlot></BoxPlot> : <BarPlot></BarPlot>}
                                                 </div>
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

    private changePlot = (event: React.ChangeEvent<{}>, newValue: number | string) => {
        this.setState({usePlot: Number(newValue)});
    };

    private toggleControls(): void {
        if (this.state.components.length === 1) {
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
