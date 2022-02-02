import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/app'
import { createTheme , MuiThemeProvider } from '@material-ui/core'

const theme = createTheme ({
    palette: {
        primary: {
            main: '#E3E6E8', // Gray
        },
        secondary: {
            main: '#F48024', // Orange
        }
    }
})

ReactDOM.render(
    <MuiThemeProvider theme={theme}>
        <App/>
    </MuiThemeProvider>,
    document.getElementById('app-root'),
)

// Check config is working for observable non instantiated attributes.
// https://mobx.js.org/installation.html#installation
// eslint-disable-next-line no-prototype-builtins
if (!new class { x: any }().hasOwnProperty('x')) throw new Error('Transpiler is not configured correctly to set defaults for props.')