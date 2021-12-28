import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/app';

function renderLoop() {
    ReactDOM.render(
        <App />,
        document.getElementById('app-root'),
    )
}
  
setInterval(renderLoop, 1000);
