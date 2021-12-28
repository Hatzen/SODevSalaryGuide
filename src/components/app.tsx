import React from "react";
import { CsvRowMapper } from "../mapper/CsvRowMapper";
import Storage from "../model/storage";
import StackOverflowCsvReader from "../services/stackOverflowCsvReader";
import BoxPlot from "./boxplot";

export default class App extends React.Component {

    private storage: Storage = new Storage() 

    componentDidMount() {
        this.loadData()
    }

    render() {
        return (
            <div>
                <h1>test</h1>
                <BoxPlot storage={this.storage} ></BoxPlot>
            </div>
        );
    }
/*
<Allotment >
                <Allotment.Pane minSize={200}>
                    <BoxPlot >
                </Allotment.Pane>
                <Allotment.Pane snap>
                </Allotment.Pane>
            </Allotment>
            */
    private loadData () {
        const reader = new StackOverflowCsvReader()
        const mapper = new CsvRowMapper()
        this.storage.currentConfig.selectedYears.forEach(year => {
            let counterForYear = 0
            let hitsForYear = 0
            reader.startWorkerForYear(year, (csvRowRaw) => {
                const rowEntry = mapper.map(csvRowRaw)
                debugger
                if (rowEntry.salary !== -1) {
                    const listForYear = this.storage.parsedDataByYear[year as any]
                    if (listForYear == null) {
                        this.storage.parsedDataByYear[year as any] = []
                    }
                    this.storage.parsedDataByYear[year as any].push(rowEntry)
                    this.storage.parsedData.push(rowEntry)
                    hitsForYear++
                }
                counterForYear++
            })
        })
    }
}