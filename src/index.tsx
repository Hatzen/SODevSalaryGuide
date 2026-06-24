import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './components/app'
import { createTheme , ThemeProvider } from '@mui/material/styles'
import { configure } from 'mobx'

// Disable strict mode for better performance with frequent observable updates
configure({ enforceActions: 'never' })

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

ReactDOM.createRoot(
    document.getElementById('app-root') as HTMLElement
).render(
    <ThemeProvider theme={theme}>
        <App/>
    </ThemeProvider>
)

// Check config is working for observable non instantiated attributes.
// https://mobx.js.org/installation.html#installation
// eslint-disable-next-line no-prototype-builtins, @typescript-eslint/no-explicit-any
if (!Object.prototype.hasOwnProperty.call(new class { x = 0 }(), 'x')) throw new Error('Transpiler is not configured correctly to set defaults for props.')