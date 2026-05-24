import React, { useEffect, useState } from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import { Typography } from '@material-ui/core'
import { CHUNK_COUNT_PER_YEAR } from '../model/constantMetaData'
import { injectClause, StoreProps } from '../stores/storeHelper'
import { inject, observer } from 'mobx-react'
import Loader from 'react-loader-spinner'

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
        // TODO: Info Button explain all relevant aspects to consider the salary which are not matched by the survey..
        //   CompanyBranch (Banks, Resellers), How old the company is (Backup money), etc.
        return (
            <div>
                <AppBar position='static'>
                    <Toolbar>
                        <IconButton onClick={this.props.menuClicked} color='inherit' aria-label='Menu'>
                            <MenuIcon />
                        </IconButton>
                        <Typography variant='h5'>
                            Stackoverflow Developer Salary Guide
                        </Typography>
                        {this.loader}
                    </Toolbar>
                </AppBar>
            </div>
        )
    }

    get loader(): JSX.Element {
        const maxChunks = Object.values(CHUNK_COUNT_PER_YEAR)
            .reduce((previousValue: number, currentValue: number) => {
                return 0 + previousValue + currentValue
            })
        const chunksDownloaded = Object.values(this.props.entryStore!.parsedDataByYear)
            .map((resultSetForYear) =>  resultSetForYear.chunksParsed)
            .reduce((previousValue: number, currentValue: number) => {
                return 0 + previousValue + currentValue
            }, 0)
        const loadingPercentage = Math.round(chunksDownloaded / maxChunks * 100)
        if (loadingPercentage > 99) {
            return <div></div>
        }
        return (
            <div style={{padding: 'auto', position: 'absolute', right: '25px'}}>
                <Typography variant='body1'>
                    <div style={{}}>
                        {loadingPercentage} %
                    </div>
                </Typography>
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
        return navigator.connection!
    }

}

export default inject(...injectClause)(observer(MenuAppBar))
