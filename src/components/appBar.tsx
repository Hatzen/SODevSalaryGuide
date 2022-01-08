import React, { useEffect, useState } from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import { Typography } from '@material-ui/core'

export interface MenuAppBarProps {
  menuClicked: () => void
}
// https://medium.com/@vivekjoy/usenetwork-create-a-custom-react-hook-to-detect-online-and-offline-network-status-and-get-network-4a2e12c7e58b
// https://v1.mui.com/demos/app-bar/
export default class MenuAppBar extends React.Component<MenuAppBarProps> {
    
    /*
    constructor(props: any) {
        super(props)
        /*const [state, setState] = useState(() => {
            return {
                since: undefined,
                online: navigator.onLine,
                ...this.getNetworkConnectionInfo(),
            }
        })
    }*/
    

    render(): JSX.Element {
    // TODO: Info Button explain all relevant aspects to consider the salary.
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

                        <Typography variant='h5'>
                            Stackoverflow Developer Salary Guide
                        </Typography>
                        NetworkInformation.downlink
                    </Toolbar>
                </AppBar>
            </div>
        )
    }
    /*
    getNetworkConnectionInfo(): any {
        const connection = this.getNetworkConnection()
        if (!connection) {
            return {}
        }
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
                    (prevState): any => (
                        {
                            ...prevState,
                            online: false,
                            since: new Date().toString(),
                        })
                )
            }
            const handleConnectionChange = (): any => {
                setState((prevState) => ({
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

    getNetworkConnection(): any {
        return (
            navigator.connection
            // ||
            //navigator.mozConnection ||
            // navigator.webkitConnection ||
            // null
        )
    }*/

    /*
    getNetworkConnectionInfo() {
        const connection = getNetworkConnection();
      if (!connection) {
          return {};
        }
      return {
          rtt: connection.rtt,
          type: connection.type,
          saveData: connection.saveData,
          downLink: connection.downLink,
          downLinkMax: connection.downLinkMax,
          effectiveType: connection.effectiveType,
        };
      }*/


}
