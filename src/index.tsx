import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/app';
import { createTheme , MuiThemeProvider } from '@material-ui/core';
import { Provider } from 'react-redux'

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

const store: any = {} // TODO:

ReactDOM.render(
    // <Provider store={store}>
        <MuiThemeProvider theme={theme}>
            <App/>
        </MuiThemeProvider>,
    // </Provider>,
    document.getElementById('app-root'),
)