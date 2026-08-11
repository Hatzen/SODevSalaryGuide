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

    async startWorkerForYear (
        resultsetForYear: ResultSetForYear,
        consumer: (row: Papa.ParseStepResult<CsvRow>) => void,
        completed: (rawRows: CsvRow[]) => void,
        onValidEntry?: (entry: SurveyEntry) => void
    ): Promise<void> {
        const year = resultsetForYear.year.toString()
        const chunkCountForYear = CHUNK_COUNT_PER_YEAR[year]
        resultsetForYear.chunksParsed = 0
        resultsetForYear.chunksAvailable = chunkCountForYear
        
        await this.handleNextChunk(resultsetForYear, consumer, completed, onValidEntry)
    }

    private async handleNextChunk (
        resultsetForYear: ResultSetForYear,
        consumer: (row: Papa.ParseStepResult<CsvRow>) => void,
        completed: (rawRows: CsvRow[]) => void,
        onValidEntry?: (entry: SurveyEntry) => void
    ): Promise<void> {
        resultsetForYear.chunksParsed++
        if (resultsetForYear.chunksParsed > resultsetForYear.chunksAvailable) {
            return
        }
        const fileName = this.generateFileName(resultsetForYear.year.toString(), resultsetForYear.chunksParsed)
        const fileUrl = this.baseUrl + '/' + fileName

        const worker = new Worker(new URL('./parseWorker.ts', import.meta.url))

        try {
            const result = await new Promise<any>((resolve, reject) => {
                worker.onmessage = (e) => {
                    const msg = e.data
                    if (msg.type === 'result') {
                        resolve(msg)
                    } else if (msg.type === 'error') {
                        reject(new Error(msg.error))
                    }
                }
                worker.onerror = (err) => {
                    reject(err)
                }
                worker.postMessage({
                    type: 'parse',
                    url: fileUrl,
                    id: resultsetForYear.chunksParsed
                })
            })

            const validRows: SurveyEntry[] = []
            let invalidCount = 0
            const rawRows: CsvRow[] = []
            const mapper = new CsvRowMapper(resultsetForYear.year)

            for (const row of result.data) {
                const rowEntry = mapper.map({ data: row, meta: { fields: Object.keys(row) } } as Papa.ParseStepResult<CsvRow>)
                if (rowEntry.isValid) {
                    validRows.push(rowEntry)
                    onValidEntry?.(rowEntry)
                } else {
                    invalidCount++
                }
                rawRows.push(row)
                consumer({ data: row, meta: { fields: Object.keys(row) } } as Papa.ParseStepResult<CsvRow>)
            }

            transaction(() => {
                Array.prototype.push.apply(resultsetForYear.resultSet, validRows)
                resultsetForYear.invalidEntryCount += invalidCount
                resultsetForYear.overallEntryCount += result.data.length
            })

            completed(rawRows)

            await this.handleNextChunk(resultsetForYear, consumer, completed, onValidEntry)
        } finally {
            worker.terminate()
        }
    }

    private generateFileName(year: string, chunk: number): string {
        return year + '-chunk-' + chunk + '.csv'
    }

    private get baseUrl(): string {
        return location.protocol + '//' + location.host + location.pathname.substring(0, location.pathname.length - 1)
    }
}
