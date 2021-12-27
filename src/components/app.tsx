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
            <BoxPlot storage={this.storage} ></BoxPlot>
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
            reader.startWorkerForYear(year, (csvRowRaw) => {
                const rowEntry = mapper.map(csvRowRaw)
                this.storage.parsedData.push(rowEntry)
            })
        })
    }
}