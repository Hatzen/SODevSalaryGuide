import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/app';
import { createTheme , MuiThemeProvider } from '@material-ui/core';
import { Provider } from 'mobx-react'
import Store from './model/Store';

const theme = createTheme ({
    palette: {
      primary: {
        main: '#E3E6E8', // Gray
      },
      secondary: {
        main: '#F48024', // Gray
      }
    }
  });

const store: Store = new Store()

ReactDOM.render(
    <MuiThemeProvider theme={theme}>
      <Provider entryStore={store}>
          <App/>
      </Provider>
    </MuiThemeProvider>,
    document.getElementById('app-root'),
)

// Check config is working for observable non instantiated attributes.
// https://mobx.js.org/installation.html#installation
if (!new class { x: any }().hasOwnProperty('x')) throw new Error('Transpiler is not configured correctly')