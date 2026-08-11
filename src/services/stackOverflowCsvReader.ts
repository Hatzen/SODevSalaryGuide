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
        worker: true,
        delimiter: ',',
        header: true
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

        const validRows: SurveyEntry[] = []
        let invalidCount = 0
        let totalCount = 0
        const rawRows: CsvRow[] = []
        const mapper = new CsvRowMapper(resultsetForYear.year)
        let normalizedFields: string[] | null = null

        await new Promise<void>((resolve, reject) => {
            Papa.parse(fileUrl, {
                ...StackOverflowCsvReader.BASIC_CONFIG,
                step: (row: Papa.ParseStepResult<CsvRow>) => {
                    if (!normalizedFields && row.meta && row.meta.fields) {
                        normalizedFields = row.meta.fields.map((field, index) =>
                            field == null || field === '' ? `${StackOverflowCsvReader.UNNAMED_COLUMN_PREFIX}${index}` : field
                        )
                    }

                    const normalizedData: CsvRow = {}
                    if (normalizedFields && row.meta && row.meta.fields) {
                        for (let i = 0; i < row.meta.fields.length; i++) {
                            const originalKey = row.meta.fields[i]
                            const normalizedKey = normalizedFields[i]
                            if (normalizedKey !== undefined && originalKey !== undefined) {
                                normalizedData[normalizedKey] = row.data[originalKey]
                            }
                        }
                    }

                    const normalizedRow = { ...row, data: normalizedData } as Papa.ParseStepResult<CsvRow>
                    const rowEntry = mapper.map(normalizedRow)
                    if (rowEntry.isValid) {
                        validRows.push(rowEntry)
                        onValidEntry?.(rowEntry)
                    } else {
                        invalidCount++
                    }
                    totalCount++
                    rawRows.push(row.data)
                    consumer(row)
                },
                complete: () => {
                    transaction(() => {
                        Array.prototype.push.apply(resultsetForYear.resultSet, validRows)
                        resultsetForYear.invalidEntryCount += invalidCount
                        resultsetForYear.overallEntryCount += totalCount
                    })
                    completed(rawRows)
                    resolve()
                },
                error: (err: any) => {
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
