import React from 'react'
import entryStore from '../model/store'
import BoxPlot from './boxplot'
import { Allotment, AllotmentHandle } from 'allotment'
import 'allotment/dist/style.css'
import ControlPane from './controlPane'
import DisclaimerModal from './disclaimerModal'
import MenuAppBar from './appBar'
import { Provider } from 'mobx-react'

class App extends React.Component {
    private controlPane: React.RefObject<AllotmentHandle>
    
    constructor(props: any) {
        super(props)
        this.controlPane = React.createRef()
        this.state ={
            components: [0, 1]
        }
    }

    render(): JSX.Element {
        const fitAll = {position: 'absolute' as any, top:0, left:0, bottom: 0, right:0}
        const stores = {
            entryStore
        }

        const panes = (this.state as any).components

        return (
            <div style={fitAll}>
                <Provider {...stores}>
                    <DisclaimerModal fullScreen={false}></DisclaimerModal>
                    <MenuAppBar menuClicked={this.toggleControls.bind(this)}></MenuAppBar>
                    <div style={{position: 'absolute', top: 64, bottom: 0, left: 0, right:0}}>
                        <Allotment ref={this.controlPane}>
                            {panes.map((pane: number) => {
                                if (pane === 0) {
                                    return (
                                        <Allotment.Pane key={pane}>
                                            <BoxPlot></BoxPlot>
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