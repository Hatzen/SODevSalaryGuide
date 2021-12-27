import './index.css'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/app';

const salaryKey = 'Including bonus, what is your annual compensation'
function renderLoop() {
    ReactDOM.render(
        <App />,
        document.getElementById('app-root'),
    )
}
  
setInterval(renderLoop, 1000);
