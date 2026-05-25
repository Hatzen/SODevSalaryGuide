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
import { Tab, Tabs } from '@mui/material'
import { StoreProps } from '../stores/storeHelper'
import SurveyEntry from '../model/surveyEntry'
import RawDataTable from './rawDataTable'
import ConsideredDataTable from './consideredDataTable'
import { uiStore } from '../stores/uiStore'

interface AppState {
    components: number[],
    tabIndex: number
}

class App extends React.Component<Record<string, unknown>, AppState> {
    private controlPane: React.RefObject<AllotmentHandle>
    
    constructor(props: Record<string, unknown>) {
        super(props)
        this.controlPane = React.createRef<AllotmentHandle>()
        this.state ={
            components: [0, 1],
            tabIndex: 0
        }
        // Store must be created only once.
        SurveyEntry.entryStore = entryStore
    }

    render(): JSX.Element {
        const fitAll: React.CSSProperties = {position: 'absolute', top:0, left:0, bottom: 0, right:0}
        const stores: StoreProps = {
            entryStore,
            controlStore,
            uiStore: uiStore
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
                                                     value={this.state.tabIndex}
                                                     onChange={this.changeTab}>
                                                     <Tab label="Salary" />
                                                     <Tab label="Participation" />
                                                     <Tab label="Raw Data" />
                                                     <Tab label="Considered Data" />
                                                 </Tabs>
                                             </div>
                                             <div style={{position: 'relative', top: 0, left: 0, right: 0, height: 'calc(100% - 48px)', width: '100%'}}>
                                                 <div style={{width: '100%', height: '100%'}}>
                                                     {this.state.tabIndex === 0 ? <BoxPlot></BoxPlot> :
                                                      this.state.tabIndex === 1 ? <BarPlot></BarPlot> :
                                                      this.state.tabIndex === 2 ? <RawDataTable></RawDataTable> :
                                                      <ConsideredDataTable></ConsideredDataTable>}
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

    private changeTab = (event: React.ChangeEvent<{}>, newValue: number | string) => {
        this.setState({tabIndex: Number(newValue)});
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
