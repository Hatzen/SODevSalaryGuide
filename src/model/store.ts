import Config from "./config";
import FreeCurrency from "./currencyValues";
import DefaultConfig from "./defaultConfig";
import { makeAutoObservable } from "mobx";
import CurrencyService from "../services/currencyService";
import StackOverflowCsvReader from "../services/stackOverflowCsvReader";
import { ParseStepResult } from "papaparse";
import CsvRow from "./csvRow";
import ResultSetForYear from "./resultsetForYear";

// https://devlinduldulao.pro/mobx-in-a-nutshell/
export class EntryStore {
    
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
            .then(this.setCurrencyValues.bind(this))
            .then(this.initParser.bind(this))
    }

    setCurrencyValues(currencyValues: FreeCurrency): void {
        debugger
        this.currencyValues = currencyValues
    }

    initParser (): void {
        const _this = this
        const reader = new StackOverflowCsvReader()
        this.currentConfig.selectedYears.forEach(year => {
            const resultsetForYear = new ResultSetForYear()
            resultsetForYear.year = parseInt(year)
            this.parsedDataByYear[year as any] = resultsetForYear
            reader.startWorkerForYear(
                resultsetForYear,
                this.addRow,
                function () {
                    debugger
                    // Force update.
                    // this.setState({ key: (Math.random()) }); // TODO: Should be done by mobx
                    const parsed = _this.parsedDataByYear[year as any].chunksParsed
                    const available = _this.parsedDataByYear[year as any].chunksAvailable
                    const invalidEntryCount = _this.parsedDataByYear[year as any].invalidEntryCount
                    const overallEntryCount = _this.parsedDataByYear[year as any].overallEntryCount
                    console.log('Finished parsing a chunk for year: ' + year + '\n'
                         + '\t chunks parsed ' + parsed + ' chunks to go ' + available + '\n '
                         + '\t entries parsed ' + overallEntryCount + ' invalid ones ' + invalidEntryCount + ' ')
                }.bind(this)
            )
        })
    }

    private addRow (csvRowRaw: ParseStepResult<CsvRow>): void  {
        // TODO: 
    }

    private onChunkComplete () {
        
    }

}

export type EntriesByYearMap = { [year: number]: ResultSetForYear }

export interface StoreProps {  // TODO: Making it optional is bad i guess..
    entryStore?: EntryStore
}

export default new EntryStore()