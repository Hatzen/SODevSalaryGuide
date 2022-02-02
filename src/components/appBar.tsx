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
// https://medium.com/@vivekjoy/usenetwork-create-a-custom-react-hook-to-detect-online-and-offline-network-status-and-get-network-4a2e12c7e58b
// https://v1.mui.com/demos/app-bar/
class MenuAppBar extends React.Component<MenuAppBarProps> {
    
    /*
    constructor(props: MenuAppBarProps) {
        super(props)
        /*const [state, setState] = useState(() => {
            return {
                since: undefined,
                online: navigator.onLine,
                ...this.getNetworkConnectionInfo(),
            }
        })
        // const info = this.getNetworkConnectionInfo()
        //
    }
    */
    

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
        //
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

    getNetworkConnectionInfo(): any {
        const connection = this.getNetworkConnection()
        if (!connection) {
            return {}
        }
        //
        return {
            rtt: connection.rtt,
            type: connection.type,
            saveData: connection.saveData,
            downLink: connection.downLink,
            downLinkMax: connection.downLinkMax,
            effectiveType: connection.effectiveType,
        }
    }
    
    useNetwork(): any {
        const [state, setState] = useState(() => {
            return {
                since: undefined,
                online: navigator.onLine,
                ...this.getNetworkConnectionInfo(),
            }
        })
        useEffect(() => {
            const handleOnline = (): void => {
                setState(
                    (prevState: any): any => ({
                        ...prevState,
                        online: true,
                        since: new Date().toString(),
                    }) as any)
            }
            const handleOffline = (): any => {
                setState(
                    (prevState: any): any => (
                        {
                            ...prevState,
                            online: false,
                            since: new Date().toString(),
                        })
                )
            }
            const handleConnectionChange = (): any => {
                setState((prevState: any) => ({
                    ...prevState,
                    ...this.getNetworkConnectionInfo(),
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

    getNetworkConnection(): NetworkInformation & any {
        return (
            navigator.connection
            // ||
            //navigator.mozConnection ||
            // navigator.webkitConnection ||
            // null
        )
    }

}

export default inject(...injectClause)(observer(MenuAppBar))