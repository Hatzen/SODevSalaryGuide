import SurveyEntry from './surveyEntry'
import { makeAutoObservable } from 'mobx'
import CsvRow from './csvRow'

export default class ResultSetForYear {
    resultSet: SurveyEntry[] = []
    overallEntryCount = 0
    invalidEntryCount = 0

    year = -1

    chunksAvailable = -1
    chunksParsed = -1

    rawCsvRows: CsvRow[] = []

    constructor() {
        makeAutoObservable(this)
    }
}