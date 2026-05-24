import FreeCurrency from '../model/currencyValues'
import { makeAutoObservable } from 'mobx'
import CurrencyService from '../services/currencyService'
import StackOverflowCsvReader from '../services/stackOverflowCsvReader'
import { ParseStepResult } from 'papaparse'
import CsvRow from '../model/csvRow'
import ResultSetForYear from '../model/resultSetForYear'
import { AVAILABLE_YEARS } from '../model/constantMetaData'

// https://devlinduldulao.pro/mobx-in-a-nutshell/
export class EntryStore {
    
    parsedData: ResultSetForYear = new ResultSetForYear()
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
        2022: new ResultSetForYear(),
        2023: new ResultSetForYear(),
        2024: new ResultSetForYear(),
        2025: new ResultSetForYear()
    }

    currencyValues!: FreeCurrency
    reader!: StackOverflowCsvReader

    constructor() {
        makeAutoObservable(this)
        this.loadData()
    }

    /**
     * Actions
     */
    
    loadData (): void {
        const currentYear = AVAILABLE_YEARS[-1]
        new CurrencyService().getCurrencies()
            .then(this.setCurrencyValues.bind(this))
            .then(() => this.initParser(currentYear))
    }

    setCurrencyValues(currencyValues: FreeCurrency): void {
        this.currencyValues = currencyValues
    }

    setDataForYear (entrySet: ResultSetForYear): void {
        this.parsedDataByYear[entrySet.year] = entrySet
        
        // TODO: This might lead to a race condition?
        this.parsedData.resultSet = this.parsedData.resultSet.concat(entrySet.resultSet)
    }

    initParser (year: string): void {
        // TODO: Implement
        // this.reader.cancleCurrentloading

        const resultsetForYear = new ResultSetForYear()
        resultsetForYear.year = parseInt(year)
        this.reader.startWorkerForYear(
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
    }

    private addRow (csvRowRaw: ParseStepResult<CsvRow>): void  {
        // TODO:
    }

    private onChunkComplete (): void {
        // TODO
    }

}

export type EntriesByYearMap = { [year: number]: ResultSetForYear }

export default new EntryStore()