import { Checkbox, FormControlLabel } from '@material-ui/core'
import React, { ChangeEvent } from 'react'

interface ControlComponentWrapperProps {
    controlComponent: JSX.Element
    title: string
    isEnabled: boolean
    enable: (event: ChangeEvent<any>, isEnabled: boolean) => void
}

export default class ControlComponentWrapper extends React.Component<ControlComponentWrapperProps> {
    
    render(): JSX.Element {
        return (
            <div style={{padding: '5px', marginTop: '10px'}}>
                <div style={{display: 'block', float: 'left', width:'100%',marginLeft:'-30px', marginBottom: '5px'}}>
                    
                    <FormControlLabel
                        label={this.props.title}
                        control={<Checkbox defaultChecked={this.props.isEnabled} onChange={this.props.enable} />}
                        labelPlacement="start"
                    />
                    
                </div>
                {this.props.controlComponent}
            </div>
        )
    }

}
