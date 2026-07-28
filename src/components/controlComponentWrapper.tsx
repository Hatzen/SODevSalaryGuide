import { Checkbox } from '@mui/material'
import { Typography } from '@mui/material'
import React from 'react'

interface ControlComponentWrapperProps {
    controlComponent: JSX.Element
    title: string
    isEnabled: boolean
    enable: (event: React.ChangeEvent<HTMLInputElement>, isEnabled: boolean) => void
    count?: number
    children?: React.ReactNode
}

export default class ControlComponentWrapper extends React.Component<ControlComponentWrapperProps> {
    
    render(): JSX.Element {
        return (
            <div style={{marginTop: '8px'}}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px'}}>
                    <Checkbox
                        color="secondary"
                        checked={this.props.isEnabled}
                        onChange={this.props.enable}
                        size="small"
                    />
                    <Typography variant="body1" color="secondary">{this.props.title}</Typography>
                    {this.props.count !== undefined && (
                        <Typography variant="body2" style={{ color: '#666', fontSize: '0.85em' }}>
                            ({this.props.count})
                        </Typography>
                    )}
                </div>
                <div style={{marginLeft: '25px'}}>
                    {this.props.controlComponent}
                </div>
            </div>
        )
    }
}
