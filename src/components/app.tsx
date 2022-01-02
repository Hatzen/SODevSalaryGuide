import React from "react";
import EntryStore, { EntryStoreProps } from "../model/Store";
import BoxPlot from "./boxplot";
import { Allotment } from "allotment";
import "allotment/dist/style.css";
import ControlPane from './controlPane'
import DisclaimerModal from "./disclaimerModal";
import MenuAppBar from "./appBar";
import { inject, IWrappedComponent } from "mobx-react";

interface AppProps {  // extends StoreProps 

}

class App extends React.Component<AppProps> {
    static defaultProps = {} as AppProps; // TODO: Why do we need this?

    render() {
        const fitAll = {position: 'absolute' as any, top:0, left:0, bottom: 0, right:0}
        
        const { counterStore, title } = this.props;

        return (
            <div style={fitAll}>
                <DisclaimerModal fullScreen={false}></DisclaimerModal>
                <MenuAppBar></MenuAppBar>
                <Allotment >
                    <Allotment.Pane>
                        <BoxPlot></BoxPlot>
                    </Allotment.Pane>
                    <Allotment.Pane snap maxSize={400}>      
                        <ControlPane></ControlPane>
                    </Allotment.Pane>
                </Allotment>
            </div>
        );
    }
    
}

export default inject('entryStore')(App) as typeof App & IWrappedComponent<AppProps>