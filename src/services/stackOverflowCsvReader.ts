import { ParseStepResult } from 'papaparse'
import { transaction } from 'mobx'
import { CsvRowMapper } from '../mapper/CsvRowMapper'
import { CHUNK_COUNT_PER_YEAR } from '../model/constantMetaData'
import CsvRow from '../model/csvRow'
import ResultSetForYear from '../model/resultSetForYear'
import SurveyEntry from '../model/surveyEntry'

export default class StackOverflowCsvReader {

    static readonly UNNAMED_COLUMN_PREFIX =  'columnIndex-'

    private worker: Worker | null = null

    startWorkerForYear (
        resultsetForYear: ResultSetForYear,
        consumer: (row: ParseStepResult<CsvRow>) => void,
        completed: (rawRows: CsvRow[]) => void,
        onValidEntry?: (entry: SurveyEntry) => void
    ): void {
        if (this.worker) {
            this.worker.onmessage = null
            this.worker.onerror = null
            this.worker.terminate()
            this.worker = null
        }

        this.worker = new Worker(new URL('./parseWorker.ts', import.meta.url))

        this.worker.onmessage = (e) => {
            const msg = e.data

            if (msg.type === 'error') {
                console.error('Parse worker error for chunk', msg.id, ':', msg.error)
                this.handleNextChunk(resultsetForYear, consumer, completed, onValidEntry)
                return
            }

            if (msg.type === 'result') {
                const rows = msg.data as any[]
                const validRows: SurveyEntry[] = []
                let invalidCount = 0
                const rawRows: CsvRow[] = []

                const mapper = new CsvRowMapper(resultsetForYear.year)

                for (const row of rows) {
                    const csvRow = row as CsvRow
                    const rowEntry = mapper.map({ data: csvRow, meta: { fields: Object.keys(csvRow) } } as ParseStepResult<CsvRow>)

                    if (rowEntry.isValid) {
                        validRows.push(rowEntry)
                        onValidEntry?.(rowEntry)
                    } else {
                        invalidCount++
                    }
                    rawRows.push(csvRow)
                    consumer({ data: csvRow, meta: { fields: Object.keys(csvRow) } } as ParseStepResult<CsvRow>)
                }

                transaction(() => {
                    Array.prototype.push.apply(resultsetForYear.resultSet, validRows)
                    resultsetForYear.invalidEntryCount += invalidCount
                    resultsetForYear.overallEntryCount += rows.length
                })

                completed(rawRows)

                resultsetForYear.chunksParsed = msg.id
                this.handleNextChunk(resultsetForYear, consumer, completed, onValidEntry)
            }
        }

        this.worker.onerror = (err) => {
            console.error('Parse worker error:', err)
        }

        resultsetForYear.chunksParsed = 0
        resultsetForYear.chunksAvailable = CHUNK_COUNT_PER_YEAR[resultsetForYear.year.toString()]

        this.handleNextChunk(resultsetForYear, consumer, completed, onValidEntry)
    }

    private handleNextChunk (
        resultsetForYear: ResultSetForYear,
        consumer: (row: ParseStepResult<CsvRow>) => void,
        completed: (rawRows: CsvRow[]) => void,
        onValidEntry?: (entry: SurveyEntry) => void
    ): void {
        if (!this.worker) return

        resultsetForYear.chunksParsed++
        if (resultsetForYear.chunksParsed > resultsetForYear.chunksAvailable) {
            this.worker.terminate()
            this.worker = null
            return
        }
        const fileName = this.generateFileName(resultsetForYear.year.toString(), resultsetForYear.chunksParsed)
        const fileUrl = this.baseUrl + '/' + fileName
        this.worker.postMessage({
            type: 'parse',
            url: fileUrl,
            id: resultsetForYear.chunksParsed
        })
    }

    private generateFileName(year: string, chunk: number): string {
        return year + '-chunk-' + chunk + '.csv'
    }

    private get baseUrl(): string {
        return location.protocol + '//' + location.host + location.pathname.substring(0, location.pathname.length - 1)
    }
}
