import React from "react";
import { CsvRowMapper } from "../mapper/CsvRowMapper";
import Store from "../model/Store";
import CurrencyService from "../services/currencyService";
import StackOverflowCsvReader from "../services/stackOverflowCsvReader";
import BoxPlot from "./boxplot";

export default class App extends React.Component {

    componentDidMount() {
        this.loadData()
    }

    render() {
        return (
            <div>
                <h1>Salary per Year Boxplots</h1>
                <BoxPlot></BoxPlot>
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
        new CurrencyService().getCurrencies()
            .then(currencyValues => {
                Store.currencyValues = currencyValues
                this.initParser()
            })
    }

    private initParser (): void {
        const reader = new StackOverflowCsvReader()
        Store.currentConfig.selectedYears.forEach(year => {
            let counterForYear = 0
            let hitsForYear = 0
            reader.startWorkerForYear(year, (csvRowRaw) => {
                const numYear = parseInt(year)
                const mapper = new CsvRowMapper(numYear)
                const rowEntry = mapper.map(csvRowRaw)
                if (rowEntry.isValid) {
                    Store.parsedData.push(rowEntry)

                    const listForYear = Store.parsedDataByYear[numYear]
                    if (listForYear == null) {
                        Store.parsedDataByYear[numYear] = []
                    }
                    Store.parsedDataByYear[numYear].push(rowEntry)
                    hitsForYear++
                }
                counterForYear++
                if (hitsForYear > 1000) {
                    debugger
                }
            },
            () => {
                // Force update.
                this.setState({ key: Math.random() });
                console.log('Finished parsing data for year: ' + year + ' found ' + hitsForYear + ' salary infos in ' + counterForYear + ' rows')
            })
        })
    }
}