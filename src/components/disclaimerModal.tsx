import React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'

interface IDisclaimerModalProps {
    fullScreen?: boolean
}

export default class DisclaimerModal extends React.Component<IDisclaimerModalProps> {
    state = {
        visible: !this.alreadyStoredConfirmation
    }

    hide (): void {
        this.setState({ visible: false })

        localStorage.setItem('alreadyAgreed', 'true')
    }
   
    get alreadyStoredConfirmation (): boolean {
        return localStorage.getItem('alreadyAgreed') === 'true'
    }

    render(): JSX.Element {
        const { fullScreen } = this.props
        const _this = this
        return (
            <div>
                <Dialog
                    fullScreen={fullScreen ?? false}
                    open={this.state.visible}
                    aria-labelledby="responsive-dialog-title"
                >
                    <DialogTitle id="responsive-dialog-title">{'Disclaimer'}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
              The shown data is taken from stackoverflow there is no warranty that the data is correct or is related to reality.
              But it is the best approach for developers to get a short overview how the salary of other developers probably look like.

              We dont use cookies or store or gain any data from you. Feel free while playing around!
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.hide.bind(_this)} color="secondary" autoFocus>
              Got it!
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}


export const mobileDialog = (DisclaimerModal)