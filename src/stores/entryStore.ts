import FreeCurrency from '../model/currencyValues'
import { makeAutoObservable, observable, transaction } from 'mobx'
import CurrencyService from '../services/currencyService'
import StackOverflowCsvReader from '../services/stackOverflowCsvReader'
import { ParseStepResult } from 'papaparse'
import CsvRow from '../model/csvRow'
import ResultSetForYear from '../model/resultSetForYear'
import { AVAILABLE_YEARS } from '../model/constantMetaData'
import { AbstractCsvRowMapper } from '../mapper/AbstractCsvRowMapper'
import { idbRawStore, RAW_PAGE_SIZE } from '../services/idbRawStore'
import SurveyEntry from '../model/surveyEntry'
import { mark, measure } from '../utils/perfLogger'

const STORAGE_KEY_PREFIX = 'salaryGuide-'

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
    selectedYear = AVAILABLE_YEARS[AVAILABLE_YEARS.length - 1]
    isParsing = false

    // Sink that receives every valid parsed entry during streaming (wired by uiStore)
    private streamSink: ((entry: SurveyEntry) => void) | null = null

    // Buffer of raw CSV rows for the year currently being parsed, flushed to IndexedDB per page
    public rawBuffer: CsvRow[] = []
    public rawPageCount = 0
    public rawBufferYear = -1

    // Buffer for parsed entries during chunked loading; flushed to observables only after final chunk
    public pendingValidRows: SurveyEntry[] = []
    public pendingInvalidCount = 0
    public pendingTotalCount = 0

    constructor() {
        makeAutoObservable(this, {
            isParsing: observable,
            pendingValidRows: false,
            pendingInvalidCount: false,
            pendingTotalCount: false,
            rawBuffer: false,
            rawPageCount: false,
            rawBufferYear: false
        })
        this.loadData()
    }

    setStreamSink(sink: (entry: SurveyEntry) => void): void {
        this.streamSink = sink
    }

    /**
     * Actions
     */
    
    loadData (): void {
        this.reader = new StackOverflowCsvReader()
        const currentYear = AVAILABLE_YEARS[AVAILABLE_YEARS.length - 1]
        new CurrencyService().getCurrencies()
            .then(this.setCurrencyValues.bind(this))
        // Try to load from session storage first
        const cached = this.loadFromSession(currentYear)
        if (cached) {
            console.log('[DEBUG] Loaded data from session storage for year', currentYear)
        } else {
            this.initParser(currentYear)
        }
    }

    setCurrencyValues(currencyValues: FreeCurrency): void {
        this.currencyValues = currencyValues
    }

    setDataForYear (entrySet: ResultSetForYear): void {
        this.parsedDataByYear[entrySet.year] = entrySet
        this.parsedData.resultSet = this.parsedData.resultSet.concat(entrySet.resultSet)
    }

    initParser (year: string): void {
        this.selectedYear = year
        this.isParsing = true
        
        const resultsetForYear = this.parsedDataByYear[parseInt(year)]
        // Only clear if no existing data
        if (resultsetForYear.overallEntryCount === 0) {
            // Clear previous data to prevent memory accumulation
            this.parsedData = new ResultSetForYear()
            AbstractCsvRowMapper.clearDistinctValues()
        }
        // Store in map first so mutations trigger reactivity
        const yearData = this.parsedDataByYear[parseInt(year)]
        yearData.resultSet = []
        yearData.rawCsvRows = []
        yearData.invalidEntryCount = 0
        yearData.overallEntryCount = 0
        yearData.year = parseInt(year)
        yearData.chunksParsed = 0

        // Reset raw CSV buffering for IndexedDB pagination
        this.rawBuffer = []
        this.rawPageCount = 0
        this.rawBufferYear = parseInt(year)

        // Reset parsed-entry buffering
        this.pendingValidRows = []
        this.pendingInvalidCount = 0
        this.pendingTotalCount = 0
        
        this.reader.startWorkerForYear(
            yearData,
            this.addRow,
            this.handleRawChunk.bind(this),
            (entry) => { this.streamSink?.(entry) }
        )
    }

    private handleRawChunk(rawRows: CsvRow[], validRows: SurveyEntry[], invalidCount: number, totalCount: number): void {
        const yearData = this.parsedDataByYear[this.rawBufferYear]
        if (!yearData) return
        const parsed = yearData.chunksParsed
        const available = yearData.chunksAvailable
        const overallEntryCount = yearData.overallEntryCount
        const invalidEntryCount = yearData.invalidEntryCount
        // eslint-disable-next-line no-console
        console.log('Finished parsing a chunk for year: ' + this.rawBufferYear + '\n'
                + '\t chunks parsed ' + parsed + ' chunks to go ' + available + '\n '
                + '\t entries parsed ' + overallEntryCount + ' invalid ones ' + invalidEntryCount + ' ')

        mark('chunk-buffer-start')
        Array.prototype.push.apply(this.pendingValidRows, validRows)
        this.pendingInvalidCount += invalidCount
        this.pendingTotalCount += totalCount
        Array.prototype.push.apply(this.rawBuffer, rawRows)
        const bufferDuration = measure('chunk-buffer', 'chunk-buffer-start')
        console.log(`[PERF] Chunk buffer: ${bufferDuration.toFixed(0)}ms, pending=${this.pendingValidRows.length}, rawBuffer=${this.rawBuffer.length}`)

        mark('idb-write-start')
        while (this.rawBuffer.length >= RAW_PAGE_SIZE) {
            const page = this.rawBuffer.splice(0, RAW_PAGE_SIZE)
            void idbRawStore.savePage(this.rawBufferYear, this.rawPageCount, page)
            this.rawPageCount++
        }
        const idbDuration = measure('idb-write', 'idb-write-start')
        console.log(`[PERF] IndexedDB flush: ${idbDuration.toFixed(0)}ms, pages=${this.rawPageCount}`)

        const isLastChunk = parsed > 0 && parsed >= available
        if (isLastChunk) {
            if (this.rawBuffer.length > 0) {
                void idbRawStore.savePage(this.rawBufferYear, this.rawPageCount, this.rawBuffer.splice(0))
                this.rawPageCount++
                this.rawBuffer = []
            }
            mark('final-tx-start')
            transaction(() => {
                Array.prototype.push.apply(yearData.resultSet, this.pendingValidRows)
                yearData.invalidEntryCount += this.pendingInvalidCount
                yearData.overallEntryCount += this.pendingTotalCount
            })
            const txDuration = measure('final-tx', 'final-tx-start')
            console.log(`[PERF] Final MobX tx: ${txDuration.toFixed(0)}ms, entries=${this.pendingValidRows.length}`)
            this.pendingValidRows = []
            this.pendingInvalidCount = 0
            this.pendingTotalCount = 0
            this.isParsing = false
            // Only save parsed entries to session storage on the LAST chunk
            this.saveToSession(String(this.rawBufferYear))
        }
    }

    saveToSession(year: string): void {
        // Raw CSV rows are persisted to IndexedDB (paginated) instead of sessionStorage
        // to avoid holding the full dataset in memory. Parsed entries could be cached here
        // if sessionStorage quota permits.
        try {
            const yearNum = parseInt(year, 10)
            const data = this.parsedDataByYear[yearNum]
            void data
        } catch (e) {
            console.warn('Failed to save to session storage:', e)
        }
    }

    loadFromSession(year: string): boolean {
        try {
            const storageKey = STORAGE_KEY_PREFIX + year
            const cached = sessionStorage.getItem(storageKey)
            if (cached) {
                const data = JSON.parse(cached)
                // Only use cache if it's less than 24 hours old
                if (data.timestamp && Date.now() - data.timestamp < 24 * 60 * 60 * 1000) {
                    const yearNum = parseInt(year, 10)
                    this.parsedDataByYear[yearNum].resultSet = data.resultSet || []
                    this.parsedDataByYear[yearNum].overallEntryCount = data.overallEntryCount || 0
                    this.parsedDataByYear[yearNum].invalidEntryCount = data.invalidEntryCount || 0
                    Array.prototype.push.apply(this.parsedData.resultSet, data.resultSet || [])
                    // Populate distinct values for filters
                    this.populateDistinctValues(data.resultSet || [])
                    return true
                }
            }
        } catch (e) {
            console.warn('Failed to load from session storage:', e)
        }
        return false
    }

    private populateDistinctValues(entries: { gender?: string, country?: string, highestDegree?: string, abilities?: string[], companySize?: { min: number, max: number } }[]): void {
        const genderSet = AbstractCsvRowMapper.genders
        const countryMap = AbstractCsvRowMapper.countries
        const educationMap = AbstractCsvRowMapper.educations
        const abilityMap = AbstractCsvRowMapper.abilities
        
        for (const entry of entries) {
            if (entry.gender) genderSet.add(entry.gender)
            if (entry.country) AbstractCsvRowMapper.updateDistinctValue(countryMap, entry.country, entry.country)
            if (entry.highestDegree) AbstractCsvRowMapper.updateDistinctValue(educationMap, entry.highestDegree, entry.highestDegree)
            if (entry.abilities) {
                for (const abil of entry.abilities) {
                    AbstractCsvRowMapper.updateDistinctValue(abilityMap, abil, abil)
                }
            }
        }
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
