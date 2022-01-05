import Papa, { ParseStepResult } from 'papaparse'
import { AbstractCsvRowMapper } from '../mapper/AbstractCsvRowMapper'
import { CsvRowMapper } from '../mapper/CsvRowMapper'
import CsvRow from '../model/csvRow'
import ResultSetForYear from '../model/resultSetForYear'

export default class StackOverflowCsvReader {

    static readonly BASIC_CONFIG ={
        download: true,
        worker: false, // TODO: When setting to true, all years are parsed successfully. But not all are downloaded. When setting to false all are downloaded but not all parsed..
        // dynamicTyping: true,
        delimiter: ',',
        header: true,
        transformHeader: (header: string, index: number): string => {
            if (header == null || header === '') {
                return 'columnIndex-' + index
            }
            return header
        }
    }

    private readonly chunkCount: { [year: string]: number } = {
        '2011': 1,
        '2012': 1,
        '2013': 1,
        '2014': 1,
        '2015': 3,
        '2016': 8,
        '2017': 10,
        '2018': 20,
        '2019': 20,
        '2020': 10,
        '2021': 9
    }

    startWorkerForYear (resultsetForYear: ResultSetForYear, consumer: (row: Papa.ParseStepResult<CsvRow>) => void, completed: () => void): void {
        const config = {
            ...StackOverflowCsvReader.BASIC_CONFIG,
            step: (row: Papa.ParseStepResult<CsvRow>) => {
                this.handleRow(row, resultsetForYear)
                consumer(row)
            },
            complete: () => {
                this.handleNextChunk(resultsetForYear, config)
                completed()
            }
        }
        const year = resultsetForYear.year.toString()
        const chunkCountForYear = this.chunkCount[year]
        resultsetForYear.chunksParsed = 0
        resultsetForYear.chunksAvailable = chunkCountForYear
        
        this.handleNextChunk(resultsetForYear, config)
    }

    private handleRow (csvRowRaw: ParseStepResult<CsvRow>, resultsetForYear: ResultSetForYear): void {
        const mapper = new CsvRowMapper(resultsetForYear.year)
        const rowEntry = mapper.map(csvRowRaw)
        if (rowEntry.isValid) {
            resultsetForYear.resultSet.push(rowEntry)
        } else {
            resultsetForYear.invalidEntryCount++
        }
        resultsetForYear.overallEntryCount++
    }

    // TODO: Typing for config: ParseRemoteConfig<CsvRow>
    private handleNextChunk (resultsetForYear: ResultSetForYear, config: any): void {
        resultsetForYear.chunksParsed++
        if (resultsetForYear.chunksParsed > resultsetForYear.chunksAvailable) {
            console.error('Set for exp:' + resultsetForYear.year)
            console.log(AbstractCsvRowMapper.years)

            console.error('Set for gender:' + resultsetForYear.year)
            console.log(AbstractCsvRowMapper.genders)
            return
        }
        const fileName = this.generateFileName(resultsetForYear.year.toString(), resultsetForYear.chunksParsed)
        const fileUrl = this.baseUrl + '/' + fileName
        // TODO: All files get downloaded, but it seems only 4 Workers get ever started...
        //   More probably the missing header in the chunked files lead to errors.
        Papa.parse(fileUrl, config)
    }

    private generateFileName(year: string, chunk: number): string {
        return year + '-chunk-' + chunk + '.csv'
    }

    private get baseUrl(): string {
        return location.protocol + '//' + location.host + location.pathname.substring(0, location.pathname.length - 1)
    }
}