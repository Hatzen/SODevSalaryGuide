import './index.css'
import React from 'react'
import ReactDOM from 'react-dom'
import Papa from "papaparse"
import Plot from 'react-plotly.js';

const salaryKey = 'Including bonus, what is your annual compensation'

class Model {
    salary: number

    constructor (salary: number) {
        this.salary = salary
    }
}


// Plotty
/*
var trace1 = {
    y: [2.37, 2.16, 4.82, 1.73, 1.04, 0.23, 1.32, 2.91, 0.11, 4.51, 0.51, 3.75, 1.35, 2.98, 4.50, 0.18, 4.66, 1.30, 2.06, 1.19],
    type: 'box',
    name: 'Only Mean',
    marker: {
      color: 'rgb(8,81,156)'
    },
    boxmean: true
  };
  
  var trace2 = {
    y: [2.37, 2.16, 4.82, 1.73, 1.04, 0.23, 1.32, 2.91, 0.11, 4.51, 0.51, 3.75, 1.35, 2.98, 4.50, 0.18, 4.66, 1.30, 2.06, 1.19],
    type: 'box',
    name: 'Mean and Standard Deviation',
    marker: {
      color: 'rgb(10,140,208)'
    },
    boxmean: 'sd'
  };
  
  
  var data = [trace1, trace2];
  
  var layout = {
    title: 'Box Plot Styling Mean and Standard Deviation'
  };
  
  Plotly.newPlot('myDiv', data, layout);
*/



class App extends React.Component {

    parsedData: Model[] = []

    componentDidMount() {
        this.loadData()
    }

    render() {
        console.error("size of yValues " + this.yValues.length)
      return (
        <Plot
          data={[
            {
              y: this.yValues,
              type: 'box',
              boxmean: 'sd',
              marker: {color: 'red'},
            }
          ]}
          layout={ {width: 1000, height: 1000, title: 'A Fancy Plot'} }
        />
      );
    }

    private loadData () {
        const _this = this
        // Parse file
        // TODO: Use window.location with port etc.
        // TODO: Add all real files and chunk them to 10mb parts. Maybe compress them as well?
        const file = `http://localhost:3000/tmp.csv`
        Papa.parse(file, {
        download: true,
        worker: true,
            step: function(row: Papa.ParseStepResult<[key: string]>) {
                const currentSalary = row.data[salaryKey as any] // TODO: properly
                if (currentSalary != null) {
                    const salary = parseInt(currentSalary)
                    _this.parsedData.push(new Model(salary))
                } else {
                    _this.parsedData.push(new Model(Math.random() * 4000 + 500))
                }
                console.warn(_this.parsedData[_this.parsedData.length - 1])

                // console.log("Row:", row.data);
            },
            complete: function() {
                console.log("All done!");
            },
        dynamicTyping: true,
        delimiter: ',',
        header: true
        });
    }

    private get yValues () {
        console.error("Got called")
        return this.parsedData.map(i => i.salary)
    }

    private get xValues () {
        let count = 0
        return this.parsedData.map(i => count++)
    }
  }

// new App({}).render()

function tick() {
    ReactDOM.render(
        <App />,
        document.getElementById('app-root'),
    )
}
  
setInterval(tick, 1000);
