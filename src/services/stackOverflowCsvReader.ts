import Papa, { ParseStepResult } from 'papaparse'
import { CsvRowMapper } from '../mapper/CsvRowMapper'
import { CHUNK_COUNT_PER_YEAR } from '../model/constantMetaData'
import CsvRow from '../model/csvRow'
import ResultSetForYear from '../model/resultSetForYear'
import SurveyEntry from '../model/surveyEntry'
import { mark, measure, logLongTasks } from '../utils/perfLogger'

logLongTasks()

export default class StackOverflowCsvReader {

    static readonly UNNAMED_COLUMN_PREFIX =  'columnIndex-'

    static readonly BASIC_CONFIG ={
        download: true,
        worker: true,
        delimiter: ',',
        header: true
    }

    async startWorkerForYear (
        resultsetForYear: ResultSetForYear,
        consumer: (row: Papa.ParseStepResult<CsvRow>) => void,
        completed: (rawRows: CsvRow[], validRows: SurveyEntry[], invalidCount: number, totalCount: number) => void,
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
        completed: (rawRows: CsvRow[], validRows: SurveyEntry[], invalidCount: number, totalCount: number) => void,
        onValidEntry?: (entry: SurveyEntry) => void
    ): Promise<void> {
        resultsetForYear.chunksParsed++
        if (resultsetForYear.chunksParsed > resultsetForYear.chunksAvailable) {
            return
        }
        const fileName = this.generateFileName(resultsetForYear.year.toString(), resultsetForYear.chunksParsed)
        const fileUrl = this.baseUrl + '/' + fileName

        const validRows: SurveyEntry[] = []
        let invalidCount = 0
        let totalCount = 0
        const rawRows: CsvRow[] = []
        let normalizedFields: string[] | null = null

        const chunkStart = performance.now()
        mark(`chunk-${fileName}-start`)

        await new Promise<void>((resolve, reject) => {
            Papa.parse(fileUrl, {
                ...StackOverflowCsvReader.BASIC_CONFIG,
                complete: (results) => {
                    const parseEnd = performance.now()
                    measure('chunk-parse', `chunk-${fileName}-start`, `chunk-${fileName}-parse-end`)
                    mark(`chunk-${fileName}-parse-end`)

                    if (!normalizedFields && results.meta && results.meta.fields) {
                        normalizedFields = results.meta.fields.map((field, index) =>
                            field == null || field === '' ? `${StackOverflowCsvReader.UNNAMED_COLUMN_PREFIX}${index}` : field
                        )
                    }

                    const mapper = new CsvRowMapper(resultsetForYear.year)
                    const data = results.data as CsvRow[]
                    for (const row of data) {
                        const normalizedData: CsvRow = {}
                        if (normalizedFields && results.meta && results.meta.fields) {
                            for (let i = 0; i < results.meta.fields.length; i++) {
                                const originalKey = results.meta.fields[i]
                                const normalizedKey = normalizedFields[i]
                                if (normalizedKey !== undefined && originalKey !== undefined) {
                                    normalizedData[normalizedKey] = row[originalKey]
                                }
                            }
                        }

                        const normalizedRow = { ...row, ...normalizedData } as CsvRow
                        const rowEntry = mapper.map({ data: normalizedRow, meta: { fields: normalizedFields || Object.keys(normalizedData) } } as Papa.ParseStepResult<CsvRow>)
                        if (rowEntry.isValid) {
                            validRows.push(rowEntry)
                            onValidEntry?.(rowEntry)
                        } else {
                            invalidCount++
                        }
                        totalCount++
                        rawRows.push(row)
                    }

                    const mapEnd = performance.now()
                    measure('chunk-map', `chunk-${fileName}-parse-end`, `chunk-${fileName}-map-end`)
                    mark(`chunk-${fileName}-map-end`)

                    completed(rawRows, validRows, invalidCount, totalCount)

                    const txEnd = performance.now()
                    measure('chunk-mobx-tx', `chunk-${fileName}-map-end`, `chunk-${fileName}-tx-end`)
                    mark(`chunk-${fileName}-tx-end`)

                    const chunkEnd = performance.now()
                    measure('chunk-total', `chunk-${fileName}-start`, `chunk-${fileName}-total-end`)
                    mark(`chunk-${fileName}-total-end`)
                    console.log(
                        `[PERF] ${fileName}: total=${(chunkEnd - chunkStart).toFixed(0)}ms ` +
                        `parse=${(parseEnd - chunkStart).toFixed(0)}ms ` +
                        `map=${(mapEnd - parseEnd).toFixed(0)}ms ` +
                        `tx=${(txEnd - mapEnd).toFixed(0)}ms ` +
                        `rows=${totalCount}`
                    )

                    resolve()
                },
                error: (err: unknown) => {
                    console.error('Papa parse error for chunk', fileName, err)
                    reject(err)
                }
            } as Papa.ParseRemoteConfig<CsvRow>)
        })

        await this.handleNextChunk(resultsetForYear, consumer, completed, onValidEntry)
    }

    private generateFileName(year: string, chunk: number): string {
        return year + '-chunk-' + chunk + '.csv'
    }

    private get baseUrl(): string {
        return location.protocol + '//' + location.host + location.pathname.substring(0, location.pathname.length - 1)
    }
}
