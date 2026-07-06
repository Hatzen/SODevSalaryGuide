import React from 'react'
import entryStore from '../stores/entryStore'
import BoxPlot from './boxplot'
import BarPlot from './barplot'
import { Allotment, AllotmentHandle } from 'allotment'
import 'allotment/dist/style.css'
import ControlPane from './controlPane'
import DisclaimerModal from './disclaimerModal'
import MenuAppBar from './appBar'
import { Provider, observer } from 'mobx-react'
import { Tab, Tabs, Drawer, Autocomplete, TextField } from '@mui/material'
import { StoreProps } from '../stores/storeHelper'
import SurveyEntry from '../model/surveyEntry'
import ConsideredDataTable from './consideredDataTable'
import CurrencyConversionTable from './currencyConversionTable'
import SalaryEstimator from './salaryEstimator'
import translationStore from '../stores/translationStore'
import controlStore from '../stores/controlStore'
import { uiStore } from '../stores/uiStore'

interface AppState {
    tabIndex: number
}

class App extends React.Component<Record<string, unknown>, AppState> {
    private controlPane: React.RefObject<AllotmentHandle>

    constructor(props: Record<string, unknown>) {
        super(props)
        this.controlPane = React.createRef<AllotmentHandle>()
        this.state ={
            tabIndex: 0
        }
        SurveyEntry.entryStore = entryStore
        const urlParams = new URLSearchParams(window.location.search)
        const settingsParam = urlParams.get('settings')
        if (settingsParam) {
            try {
                controlStore.pendingState = JSON.parse(decodeURIComponent(settingsParam))
            } catch (e) {
                console.error('Failed to parse settings from URL', e)
            }
        }
    }

    componentDidMount(): void {
        uiStore.initMobileDetection()
    }

    render(): JSX.Element {
        const fitAll: React.CSSProperties = {position: 'absolute', top:0, left:0, bottom: 0, right:0}
        const stores: StoreProps = {
            entryStore,
            controlStore,
            uiStore: uiStore
        }

        const isMobile = uiStore.isMobileView
        const appBarHeight = isMobile ? 48 : 64

        return (
            <div style={fitAll}>
                <Provider {...stores}>
                    <DisclaimerModal fullScreen={isMobile} />
                    <MenuAppBar menuClicked={this.toggleControls.bind(this)} />
                    <div style={{position: 'absolute', top: appBarHeight, bottom: isMobile ? 48 : 0, left: 0, right:0}}>
                        {isMobile ? this.renderMobileLayout() : this.renderDesktopLayout()}
                    </div>
                    {isMobile && this.renderMobileFooter()}
                    <Drawer
                        anchor="right"
                        open={uiStore.controlPaneOpen && isMobile}
                        onClose={this.closeDrawer.bind(this)}
                        PaperProps={{
                            sx: { width: '100%', maxWidth: '400px', backgroundColor: '#fff' }
                        }}
                    >
                        <ControlPane />
                    </Drawer>
                </Provider>
            </div>
        )
    }

    private renderDesktopLayout(): JSX.Element {
        const t = translationStore.t
        return (
            <Allotment ref={this.controlPane}>
                <Allotment.Pane>
                    <div style={{position: 'relative', top: 0, left: 0, right: 0}} >
                        <Tabs
                            value={this.state.tabIndex}
                            onChange={this.changeTab}
                            variant="scrollable"
                            scrollButtons="auto"
                            sx={{
                                '& .MuiTabs-indicator': {
                                    backgroundColor: '#F48024'
                                },
                                '& .MuiTab-root': {
                                    color: '#F48024',
                                    '&.Mui-selected': {
                                        color: '#F48024',
                                        fontWeight: 500
                                    }
                                }
                            }}>
                            <Tab label={t.salaryTab} />
                            <Tab label={t.participationTab} />
                            <Tab label={t.consideredDataTab} />
                            <Tab label={t.currencyRatesTab} />
                            <Tab label={t.estimatorTab} />
                        </Tabs>
                    </div>
                    <div style={{position: 'relative', top: 0, left: 0, right: 0, height: 'calc(100% - 48px)', width: '100%'}}>
                        <div style={{width: '100%', height: '100%'}}>
                            {this.state.tabIndex === 0 ? <BoxPlot /> :
                                this.state.tabIndex === 1 ? <BarPlot /> :
                                    this.state.tabIndex === 2 ? <ConsideredDataTable /> :
                                        this.state.tabIndex === 3 ? <CurrencyConversionTable /> :
                                            <SalaryEstimator />}
                        </div>
                    </div>
                </Allotment.Pane>
                <Allotment.Pane snap maxSize={400}>
                    <ControlPane />
                </Allotment.Pane>
            </Allotment>
        )
    }

    private renderMobileLayout(): JSX.Element {
        const t = translationStore.t
        return (
            <div style={{width: '100%', height: '100%'}}>
                <div style={{position: 'relative', top: 0, left: 0, right: 0}} >
                    <Tabs
                        value={this.state.tabIndex}
                        onChange={this.changeTab}
                        variant="scrollable"
                        scrollButtons="auto"
                        sx={{
                            '& .MuiTabs-indicator': {
                                backgroundColor: '#F48024'
                            },
                            '& .MuiTab-root': {
                                color: '#F48024',
                                '&.Mui-selected': {
                                    color: '#F48024',
                                    fontWeight: 500
                                }
                            }
                        }}>
                        <Tab label={t.salaryTab} />
                        <Tab label={t.participationTab} />
                        <Tab label={t.consideredDataTab} />
                        <Tab label={t.currencyRatesTab} />
                        <Tab label={t.estimatorTab} />
                    </Tabs>
                </div>
                <div style={{position: 'relative', top: 0, left: 0, right: 0, height: 'calc(100% - 48px)', width: '100%'}}>
                    <div style={{width: '100%', height: '100%'}}>
                        {this.state.tabIndex === 0 ? <BoxPlot /> :
                            this.state.tabIndex === 1 ? <BarPlot /> :
                                this.state.tabIndex === 2 ? <ConsideredDataTable /> :
                                    this.state.tabIndex === 3 ? <CurrencyConversionTable /> :
                                        <SalaryEstimator />}
                    </div>
                </div>
            </div>
        )
    }

    private renderMobileFooter(): JSX.Element {
        const t = translationStore.t
        return (
            <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: 48,
                backgroundColor: '#F48024',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                padding: '0 16px',
                zIndex: 10
            }}>
                <Autocomplete
                    options={['en', 'de']}
                    value={controlStore.language ?? 'en'}
                    onChange={(_event, value) => {
                        if (value) {
                            controlStore.setLanguage(value as 'en' | 'de')
                        }
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label={t.language}
                            size="small"
                            color="secondary"
                            style={{ width: 120, color: '#fff' }}
                        />
                    )}
                />
            </div>
        )
    }

    private changeTab = (event: React.ChangeEvent<unknown>, newValue: number | string): void => {
        this.setState({tabIndex: Number(newValue)})
    }

    private toggleControls(): void {
        uiStore.setControlPaneOpen(!uiStore.controlPaneOpen)
    }

    private closeDrawer(): void {
        uiStore.setControlPaneOpen(false)
    }

}

export default observer(App)