import FreeCurrency from '../model/currencyValues'
import { makeAutoObservable } from 'mobx'
import CurrencyService from '../services/currencyService'
import StackOverflowCsvReader from '../services/stackOverflowCsvReader'
import { ParseStepResult } from 'papaparse'
import CsvRow from '../model/csvRow'
import ResultSetForYear from '../model/resultSetForYear'
import { AVAILABLE_YEARS } from '../model/constantMetaData'
import { AbstractCsvRowMapper } from '../mapper/AbstractCsvRowMapper'

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

    constructor() {
        makeAutoObservable(this)
        this.loadData()
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
        
        this.reader.startWorkerForYear(
            yearData,
            this.addRow,
            () => {
                const parsed = yearData.chunksParsed
                const available = yearData.chunksAvailable
                const invalidEntryCount = yearData.invalidEntryCount
                const overallEntryCount = yearData.overallEntryCount
                // eslint-disable-next-line no-console
                console.log('Finished parsing a chunk for year: ' + year + '\n'
                        + '\t chunks parsed ' + parsed + ' chunks to go ' + available + '\n '
                        + '\t entries parsed ' + overallEntryCount + ' invalid ones ' + invalidEntryCount + ' ')
                
                // Save to session storage after complete
                this.saveToSession(year)
            }
        )
    }

    saveToSession(year: string): void {
        try {
            const yearNum = parseInt(year, 10)
            const data = this.parsedDataByYear[yearNum]
            const storageKey = STORAGE_KEY_PREFIX + year
            // Store only essential data (not raw CSV to save space)
            const dataToStore = {
                resultSet: data.resultSet.map(e => ({
                    _salary: e._salary,
                    currency: e.currency,
                    gender: e.gender,
                    country: e.country,
                    highestDegree: e.highestDegree,
                    expirienceInYears: e.expirienceInYears,
                    abilities: e.abilities,
                    companySize: e.companySize
                })),
                overallEntryCount: data.overallEntryCount,
                invalidEntryCount: data.invalidEntryCount,
                timestamp: Date.now()
            }
            sessionStorage.setItem(storageKey, JSON.stringify(dataToStore))
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
                    this.parsedData.resultSet = [...this.parsedData.resultSet, ...(data.resultSet || [])]
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
            if (entry.country) countryMap.set(entry.country, (countryMap.get(entry.country) || 0) + 1)
            if (entry.highestDegree) educationMap.set(entry.highestDegree, (educationMap.get(entry.highestDegree) || 0) + 1)
            if (entry.abilities) {
                for (const abil of entry.abilities) {
                    abilityMap.set(abil, (abilityMap.get(abil) || 0) + 1)
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