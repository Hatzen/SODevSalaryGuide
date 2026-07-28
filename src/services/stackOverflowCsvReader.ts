import Papa, { ParseStepResult } from 'papaparse'
import { transaction } from 'mobx'
import { CsvRowMapper } from '../mapper/CsvRowMapper'
import { CHUNK_COUNT_PER_YEAR } from '../model/constantMetaData'
import CsvRow from '../model/csvRow'
import ResultSetForYear from '../model/resultSetForYear'
import SurveyEntry from '../model/surveyEntry'

export default class StackOverflowCsvReader {

    static readonly UNNAMED_COLUMN_PREFIX =  'columnIndex-'

    static readonly BASIC_CONFIG ={
        download: true,
        worker: false, // Using worker=true for better performance with large files
        /*
Uncaught DataCloneError: Failed to execute 'postMessage' on 'Worker': function (header, index) {
            const UNNAMED_COLUMN_PREFIX = 'columnIndex-';
            if (header =...<omitted>... } could not be cloned.
        */
        
        delimiter: ',',
        header: true,
        transformHeader: function(header: string, index: number): string {
            const UNNAMED_COLUMN_PREFIX = 'columnIndex-'
            if (header == null || header === '') {
                return UNNAMED_COLUMN_PREFIX + index
            }
            return header
        }
    }

    startWorkerForYear (
        resultsetForYear: ResultSetForYear,
        consumer: (row: Papa.ParseStepResult<CsvRow>) => void,
        completed: (rawRows: CsvRow[]) => void,
        onValidEntry?: (entry: SurveyEntry) => void
    ): void {
        let validRows: SurveyEntry[] = []
        let invalidCount = 0
        let totalCount = 0
        let rawRows: CsvRow[] = []
        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const config = {
            ...StackOverflowCsvReader.BASIC_CONFIG,
            step: (row: Papa.ParseStepResult<CsvRow>) => {
                const mapper = new CsvRowMapper(resultsetForYear.year)
                const rowEntry = mapper.map(row)
                if (rowEntry.isValid) {
                    validRows.push(rowEntry)
                    onValidEntry?.(rowEntry)
                } else {
                    invalidCount++
                }
                totalCount++
                // Store raw CSV row for raw data table
                rawRows.push(row.data)
                consumer(row)
            },
            complete: () => {
                // Batch update observables once per chunk within a transaction
                transaction(() => {
                    // Replace array entirely to avoid multiple MobX notifications
                    resultsetForYear.resultSet = [...resultsetForYear.resultSet, ...validRows]
                    resultsetForYear.invalidEntryCount += invalidCount
                    resultsetForYear.overallEntryCount += totalCount
                })
                const chunkRawRows = rawRows
                validRows = []
                rawRows = []
                invalidCount = 0
                totalCount = 0

                this.handleNextChunk(resultsetForYear, config)
                // Hand the raw CSV rows of this chunk to the caller for storage
                completed(chunkRawRows)
            }
        } as Papa.ParseRemoteConfig<CsvRow>
        const year = resultsetForYear.year.toString()
        const chunkCountForYear = CHUNK_COUNT_PER_YEAR[year]
        resultsetForYear.chunksParsed = 0
        resultsetForYear.chunksAvailable = chunkCountForYear
        
        this.handleNextChunk(resultsetForYear, config)
    }

    private handleNextChunk (resultsetForYear: ResultSetForYear, config: Papa.ParseRemoteConfig<CsvRow>): void {
        resultsetForYear.chunksParsed++
        if (resultsetForYear.chunksParsed > resultsetForYear.chunksAvailable) {
            // All chunks processed, nothing more to do
            return
        }
        const fileName = this.generateFileName(resultsetForYear.year.toString(), resultsetForYear.chunksParsed)
        const fileUrl = this.baseUrl + '/' + fileName
        Papa.parse(fileUrl, config)
    }

    private generateFileName(year: string, chunk: number): string {
        return year + '-chunk-' + chunk + '.csv'
    }

    private get baseUrl(): string {
        return location.protocol + '//' + location.host + location.pathname.substring(0, location.pathname.length - 1)
    }
}
