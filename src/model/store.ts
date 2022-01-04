import Config from './config'
import FreeCurrency from './currencyValues'
import DefaultConfig from './defaultConfig'
import { makeAutoObservable } from 'mobx'
import CurrencyService from '../services/currencyService'
import StackOverflowCsvReader from '../services/stackOverflowCsvReader'
import { ParseStepResult } from 'papaparse'
import CsvRow from './csvRow'
import ResultSetForYear from './resultSetForYear'

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

    setDataForYear (entrySet: ResultSetForYear): void {
        this.parsedDataByYear[entrySet.year] = entrySet
        this.lastUpdatedYear = 'ab'
    }

    initParser (): void {
        const reader = new StackOverflowCsvReader()
        this.currentConfig.selectedYears.forEach(year => {
            const resultsetForYear = new ResultSetForYear()
            resultsetForYear.year = parseInt(year)
            reader.startWorkerForYear(
                resultsetForYear,
                this.addRow,
                () => {
                    const parsed = resultsetForYear.chunksParsed
                    const available = resultsetForYear.chunksAvailable
                    const invalidEntryCount = resultsetForYear.invalidEntryCount
                    const overallEntryCount = resultsetForYear.overallEntryCount
                    // eslint-disable-next-line no-console
                    console.log('Finished parsing a chunk for year: ' + year + '\n'
                         + '\t chunks parsed ' + parsed + ' chunks to go ' + available + '\n '
                         + '\t entries parsed ' + overallEntryCount + ' invalid ones ' + invalidEntryCount + ' ')
                    this.setDataForYear(resultsetForYear)
                }
            )
        })
    }

    private addRow (csvRowRaw: ParseStepResult<CsvRow>): void  {
        // TODO:
    }

    private onChunkComplete (): void {
        // TODO
    }

}

export type EntriesByYearMap = { [year: number]: ResultSetForYear }

export interface StoreProps {  // TODO: Making it optional is bad i guess..
    entryStore?: EntryStore
}

export default new EntryStore()