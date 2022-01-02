import Config from "./config";
import FreeCurrency from "./currencyValues";
import DefaultConfig from "./defaultConfig";
import { makeAutoObservable } from "mobx";
import CurrencyService from "../services/currencyService";
import StackOverflowCsvReader from "../services/stackOverflowCsvReader";
import { ParseStepResult } from "papaparse";
import CsvRow from "./csvRow";
import ResultSetForYear from "./resultsetForYear";

export default class EntryStore implements EntryStoreProps{
    
    parsedData: ResultSetForYear = new ResultSetForYear()
    parsedDataByYear: EntriesByYearMap = {}

    currentConfig: Config = new DefaultConfig()
    currencyValues!: FreeCurrency

    constructor() {
        makeAutoObservable(this)
        this.loadData()
    }

    /**
     * Actions
     */
    
    loadData (): void {
        new CurrencyService().getCurrencies()
            .then(this.setCurrencyValues)
            .then(this.initParser)
    }

    setCurrencyValues(currencyValues: FreeCurrency): void {
        this.currencyValues = currencyValues
    }
    
    initParser (): void {
        const reader = new StackOverflowCsvReader()
        this.currentConfig.selectedYears.forEach(year => {
            const resultsetForYear = new ResultSetForYear()
            resultsetForYear.year = parseInt(year)

            reader.startWorkerForYear(resultsetForYear, this.addRow,
            () => {
                // Force update.
                // this.setState({ key: (Math.random()) }); // TODO: Should be done by mobx
                const parsed = this.parsedDataByYear[year as any].chunksParsed
                const available = this.parsedDataByYear[year as any].chunksAvailable
                const invalidEntryCount = this.parsedDataByYear[year as any].invalidEntryCount
                const overallEntryCount = this.parsedDataByYear[year as any].overallEntryCount
                console.log('Finished parsing a chunk for year: ' + year + '\n'
                     + '\t chunks parsed ' + parsed + ' chunks to go ' + available + '\n '
                     + '\t entries parsed ' + overallEntryCount + ' invalid ones ' + invalidEntryCount + ' ')
            })
        })
    }

    private addRow (csvRowRaw: ParseStepResult<CsvRow>): void  {
        // TODO: 
    }

}

export interface EntryStoreProps {
    
    parsedData: ResultSetForYear
    parsedDataByYear: EntriesByYearMap

    currentConfig: Config
    currencyValues: FreeCurrency
}

export type EntriesByYearMap = { [year: number]: ResultSetForYear }