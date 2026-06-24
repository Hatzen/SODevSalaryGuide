import React, { useEffect, useState } from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import { Typography } from '@mui/material'
import { CHUNK_COUNT_PER_YEAR } from '../model/constantMetaData'
import { injectClause, StoreProps } from '../stores/storeHelper'
import { inject, observer } from 'mobx-react'
import Loader from 'react-loader-spinner'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import controlStore from '../stores/controlStore'
import translationStore from '../stores/translationStore'

export interface MenuAppBarProps extends StoreProps {
    menuClicked: () => void
}

interface NetworkState {
    since: string
    online: boolean
    rtt: number
    type: string
    saveData: boolean
    downLink: number
    downLinkMax: number
    effectiveType: string
}

// https://medium.com/@vivekjoy/usenetwork-create-a-custom-react-hook-to-detect-online-and-offline-network-status-and-get-network-4a2e12c7e58b
// https://v1.mui.com/demos/app-bar/
class MenuAppBar extends React.Component<MenuAppBarProps> {

    render(): JSX.Element {
        const t = translationStore.t

        return (
            <div>
                <AppBar position='static'>
                    <Toolbar>
                        <IconButton onClick={this.props.menuClicked} color='inherit' aria-label='Menu'>
                            <MenuIcon />
                        </IconButton>
                        <Typography variant='h5'>
                            {t.title}
                        </Typography>
                        {this.loader}
                        {this.languageSelector}
                    </Toolbar>
                </AppBar>
            </div>
        )
    }

    get languageSelector(): JSX.Element {
        const t = translationStore.t
        return (
            <div style={{padding: 'auto', position: 'absolute', right: '125px'}}>
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
                            style={{ width: 120, marginLeft: 'auto', marginRight: '10px' }}
                        />
                    )}
                />
            </div>
        )
    }

    get loader(): JSX.Element {
        // If entryStore or controlStore is not available, show no loader
        if (!this.props.entryStore || !this.props.controlStore) {
            return <div></div>
        }

        // Get the currently selected year
        const selectedYearStr = this.props.controlStore.controlState.selectedYear
        if (!selectedYearStr) {
            return <div></div>
        }

        // Get max chunks for the selected year
        const maxChunks = CHUNK_COUNT_PER_YEAR[selectedYearStr] || 0
        if (maxChunks === 0) {
            return <div></div>
        }

        // Get chunks parsed for the selected year
        const yearData = this.props.entryStore.parsedDataByYear[parseInt(selectedYearStr, 10)]
        const chunksDownloaded = yearData ? yearData.chunksParsed : 0

        // Calculate loading percentage
        const loadingPercentage = Math.round((chunksDownloaded / maxChunks) * 100)

        // Hide loader when loading is complete
        if (loadingPercentage >= 100) {
            return <div></div>
        }

        return (
            <div style={{padding: 'auto', position: 'absolute', right: '25px'}}>
                <div style={{}}>
                    <Typography variant='body1'>
                        {loadingPercentage} %
                    </Typography>
                </div>
                <Loader
                    type="Audio"
                    color="#F48024"
                    height={45}
                    width={45}
                    secondaryColor="#000000" />
            </div>
        )
    }

    getNetworkConnectionInfo(): NetworkState {
        const defaults: NetworkState = {
            since: new Date().toString(),
            online: false,
            rtt: 0, type: '', saveData: false,
            downLink: 0, downLinkMax: 0, effectiveType: '',
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const connection: any = this.getNetworkConnection()
        if (!connection) {
            return defaults
        }
        return {
            since: new Date().toString(),
            online: navigator.onLine,
            rtt: connection.rtt,
            type: connection.type,
            saveData: connection.saveData,
            downLink: connection.downLink,
            downLinkMax: connection.downLinkMax,
            effectiveType: connection.effectiveType,
        }
    }

    useNetwork(): NetworkState {
        const [state, setState] = useState(this.getNetworkConnectionInfo())
        useEffect(() => {
            const handleOnline = (): void => {
                setState((prevState: NetworkState): NetworkState => ({
                    ...prevState,
                    online: true,
                }))
            }
            const handleOffline = (): void => {
                setState((prevState: NetworkState): NetworkState => ({
                    ...prevState,
                    online: false,
                }))
            }
            const handleConnectionChange = (_event: Event): void => {
                const networkInfo = this.getNetworkConnectionInfo()
                setState((prevState: NetworkState) => ({
                    ...prevState,
                    ...networkInfo,
                }))
            }
            window.addEventListener('online', handleOnline)
            window.addEventListener('offline', handleOffline)
            const connection = this.getNetworkConnection()
            connection?.addEventListener('change', handleConnectionChange)
            return () => {
                window.removeEventListener('online', handleOnline)
                window.removeEventListener('offline', handleOffline)
                connection?.removeEventListener('change', handleConnectionChange)
            }
        }, [])
        return state
    }

    getNetworkConnection(): EventTarget {
        return null as unknown as EventTarget // navigator.connection!
    }

}

export default inject(...injectClause)(observer(MenuAppBar))