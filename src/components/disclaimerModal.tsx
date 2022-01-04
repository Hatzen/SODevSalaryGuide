import React from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import withMobileDialog from '@material-ui/core/withMobileDialog'

interface IDisclaimerModalProps {
  fullScreen: boolean
}

// TODO: Move from material-ui to mui https://stackoverflow.com/questions/69219552/what-is-the-difference-between-material-ui-and-mui
// https://v1.mui.com/demos/dialogs/
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
                    fullScreen={fullScreen}
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


export const mobileDialog =  withMobileDialog()(DisclaimerModal)