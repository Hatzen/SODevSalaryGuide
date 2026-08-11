import React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import translationStore from '../stores/translationStore'

import { observer } from 'mobx-react'

interface IStatisticsModalProps {
    open: boolean
    onClose: () => void
    fullScreen?: boolean
}

interface IStatisticsModalState {
    open: boolean
}

class StatisticsModal extends React.Component<IStatisticsModalProps, IStatisticsModalState> {
    constructor(props: IStatisticsModalProps) {
        super(props)
        this.state = {
            open: props.open
        }
    }

    componentDidUpdate(prevProps: IStatisticsModalProps): void {
        if (prevProps.open !== this.props.open) {
            this.setState({ open: this.props.open })
        }
    }

    private handleClose = (): void => {
        this.setState({ open: false })
        this.props.onClose()
    }

    render(): JSX.Element {
        const t = translationStore.t
        const { fullScreen } = this.props
        return (
            <Dialog
                fullScreen={fullScreen ?? false}
                open={this.state.open}
                onClose={this.handleClose}
                maxWidth="lg"
                fullWidth
                aria-labelledby="statistics-dialog-title"
            >
                <DialogTitle id="statistics-dialog-title">{t.statisticsHelp}</DialogTitle>
                <DialogContent>
                    <Section title={t.statisticsMeanTitle} text={t.statisticsMeanText} />
                    <Section title={t.statisticsMedianTitle} text={t.statisticsMedianText} />
                    <Section title={t.statisticsStdTitle} text={t.statisticsStdText} />
                    <Box sx={{ marginTop: '16px', padding: '12px', backgroundColor: '#FFF4E8', borderRadius: '6px' }}>
                        <Section title={t.statisticsRealisticTitle} text={t.statisticsRealisticText} noMargin />
                    </Box>
                    <Box sx={{ marginTop: '16px', padding: '12px', backgroundColor: '#F5F5F5', borderRadius: '6px' }}>
                        <Section title={t.statisticsQualityTitle} text={t.statisticsQualityText} noMargin />
                    </Box>
                    <Box sx={{ marginTop: '16px', padding: '12px', backgroundColor: '#FFF4E8', borderRadius: '6px' }}>
                        <Section title={t.statisticsCompanySizeTitle} text={t.statisticsCompanySizeText} />
                    </Box>
                    <Box sx={{ marginTop: '16px', padding: '12px', backgroundColor: '#F5F5F5', borderRadius: '6px' }}>
                        <Section title={t.statisticsWorkforceTitle} text={t.statisticsWorkforceText} />
                    </Box>
                    <Box sx={{ marginTop: '16px', padding: '12px', backgroundColor: '#FFF4E8', borderRadius: '6px' }}>
                        <Section title={t.statisticsSourcesTitle} text={t.statisticsSourcesText} noMargin />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleClose} color="secondary" autoFocus>
                        {t.disclaimerGotIt ?? 'Got it!'}
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
}

function Section({ title, text, noMargin }: { title: string; text: string; noMargin?: boolean }): JSX.Element {
    return (
        <Box sx={{ marginBottom: noMargin ? 0 : '16px' }}>
            <Typography variant="subtitle1" style={{ color: '#F48024', fontWeight: 600 }}>
                {title}
            </Typography>
            <DialogContentText>
                {text}
            </DialogContentText>
        </Box>
    )
}

export default observer(StatisticsModal)
