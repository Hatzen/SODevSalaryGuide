import { Checkbox, FormControlLabel } from '@material-ui/core'
import { Typography } from '@material-ui/core'
import React from 'react'

interface ControlComponentWrapperProps {
    controlComponent: JSX.Element
    title: string
    isEnabled: boolean
    enable: (event: React.ChangeEvent<HTMLInputElement>, isEnabled: boolean) => void
    count?: number
}

export default class ControlComponentWrapper extends React.Component<ControlComponentWrapperProps> {
    
    render(): JSX.Element {
        return (
            <div style={{padding: '5px', marginTop: '10px'}}>
                <div style={{display: 'block', float: 'left', width:'100%',marginLeft:'-30px', marginBottom: '5px'}}>
                    
                    <FormControlLabel
                        label={
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Typography variant="body1">{this.props.title}</Typography>
                                {this.props.count !== undefined && (
                                    <Typography variant="body2" style={{ color: '#666', fontSize: '0.85em' }}>
                                        ({this.props.count})
                                    </Typography>
                                )}
                            </div>
                        }
                        control={<Checkbox defaultChecked={this.props.isEnabled} onChange={this.props.enable} />}
                        labelPlacement="start"
                    />
                    
                </div>
                {this.props.controlComponent}
            </div>
        )
    }

}
