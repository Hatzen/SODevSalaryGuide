import Config from './config'
import FreeCurrency from './currencyValues'
import DefaultConfig from './defaultConfig'
import { makeAutoObservable } from 'mobx'
import CurrencyService from '../services/currencyService'
import StackOverflowCsvReader from '../services/stackOverflowCsvReader'
import { ParseStepResult } from 'papaparse'
import CsvRow from './csvRow'
import ResultSetForYear from './resultsetForYear'

// https://devlinduldulao.pro/mobx-in-a-nutshell/
export class EntryStore {
    
    parsedData: ResultSetForYear = new ResultSetForYear()
    // TODO: Remove initalizer as they are not needed (?)
    parsedDataByYear: EntriesByYearMap = {
        2011: new ResultSetForYear(),
        2012: new ResultSetForYear(),
        2013: new ResultSetForYear(),
        2014: new ResultSetForYear(),
        2015: new ResultSetForYear(),
        2016: new ResultSetForYear(),
        2017: new ResultSetForYear(),
        2018: new ResultSetForYear(),
        2019: new ResultSetForYear(),
        2020: new ResultSetForYear(),
        2021: new ResultSetForYear(),
        2022: new ResultSetForYear()
    }
    // TODO: Remove dummy only used for updating..
    lastUpdatedYear = '-1'

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
        this.currencyValues = currencyValues
    }

    setDataForYear (entrySet: ResultSetForYear, year: number): void {
        this.parsedDataByYear[year] = entrySet
        this.lastUpdatedYear = 'ab'
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
                () => {
                    // Force update.
                    // this.setState({ key: (Math.random()) }); // TODO: Should be done by mobx
                    const parsed = _this.parsedDataByYear[year as any].chunksParsed
                    const available = _this.parsedDataByYear[year as any].chunksAvailable
                    const invalidEntryCount = _this.parsedDataByYear[year as any].invalidEntryCount
                    const overallEntryCount = _this.parsedDataByYear[year as any].overallEntryCount
                    console.log('Finished parsing a chunk for year: ' + year + '\n'
                         + '\t chunks parsed ' + parsed + ' chunks to go ' + available + '\n '
                         + '\t entries parsed ' + overallEntryCount + ' invalid ones ' + invalidEntryCount + ' ')
                    const store = (this as any)

                    // TODO: Remove trigger update
                    store.lastUpdatedYear = 'xyz'
                    // debugger
                } // .bind(this)
            )
        })
    }

    private addRow (csvRowRaw: ParseStepResult<CsvRow>): void  {
        // TODO: 
    }

    private onChunkComplete () {
        // TODO:
    }

}

export type EntriesByYearMap = { [year: number]: ResultSetForYear }

export interface StoreProps {  // TODO: Making it optional is bad i guess..
    entryStore?: EntryStore
}

export default new EntryStore()