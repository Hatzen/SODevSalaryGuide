import { Checkbox, FormLabel } from '@material-ui/core'
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
                <div style={{display: 'inline-block', float: 'left', marginBottom: '5px'}}>
                    <FormLabel component="legend">{this.props.title}</FormLabel>
                    <Checkbox defaultChecked={this.props.isEnabled} onChange={this.props.enable} />
                </div>
                {this.props.controlComponent}
            </div>
        )
    }

}
