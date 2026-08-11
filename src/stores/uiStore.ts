import { action, makeObservable, observable, reaction } from 'mobx'
import type { ControlStore } from './controlStore'
import type { EntryStore } from './entryStore'
import SurveyEntry from '../model/surveyEntry'
import controlStore from './controlStore'
import entryStore from './entryStore'
import { Gender } from '../model/gender'
import { StatsAccumulator, BoxStats } from './statsAccumulator'

type ReactionData = {
    years: string[]
    selectedYear: string
    overallEntryCount: number
    expirienceInYears: [min: number, max: number]
    companySize: [min: number | null, max: number | null]
    gendersFilterActive: boolean
    genders: Gender[]
    abilitiesFilterActive: boolean
    abilities: string[]
    countriesFilterActive: boolean
    countries: string[]
    degreeFilterActive: boolean
    degrees: string[]
    companySizeFilterActive: boolean
    enableSalaryFilter: boolean
    salaryThresholdMin: number
    salaryThresholdMax: number
}

export class UiStore {

    filteredData: { [year: number]: SurveyEntry[] } = {}
    lastFilterUpdateTime = 0
    isMobileView = false
    controlPaneOpen = false

    boxStats: BoxStats | null = null
    private boxAccumulator = new StatsAccumulator()
    private boxStatsYear = -1
    private isStreaming = false
    private streamCounter = 0
    private readonly flushInterval = 5000

    private readonly controlStore: ControlStore
    private readonly entryStore: EntryStore
    private reactionDisposer: (() => void) | null = null
    private debounceTimer: ReturnType<typeof setTimeout> | null = null
    private latestReactionData: ReactionData | null = null

    constructor(controlStore: ControlStore, entryStore: EntryStore) {
        this.controlStore = controlStore
        this.entryStore = entryStore
        
        makeObservable(this, {
            filteredData: observable,
            lastFilterUpdateTime: observable,
            isMobileView: observable,
            controlPaneOpen: observable,
            boxStats: observable,
            updateFilteredData: action,
            setMobileView: action,
            setControlPaneOpen: action,
            recordStreamEntry: action,
            finalizeStream: action,
            rebuildBoxStats: action,
        })

        this.initMobileDetection()
        this.initReactions()
    }

    public initMobileDetection(): void {
        const checkMobile = (): void => {
            this.isMobileView = window.innerWidth < 768
        }
        checkMobile()
        window.addEventListener('resize', checkMobile)
    }

    private initReactions(): void {
        this.reactionDisposer = reaction(
            () => {
                const years = Object.keys(this.entryStore.parsedDataByYear)
                const cs = this.controlStore
                const selectedYear = this.entryStore.selectedYear
                return {
                    years,
                    selectedYear,
                    overallEntryCount: this.entryStore.parsedDataByYear[parseInt(selectedYear, 10)]?.overallEntryCount ?? 0,
                    expirienceInYears: cs.expirienceInYears,
                    companySize: cs.companySize,
                    gendersFilterActive: cs.gendersFilterActive,
                    genders: cs.genders,
                    abilitiesFilterActive: cs.abilitiesFilterActive,
                    abilities: cs.abilities,
                    countriesFilterActive: cs.countriesFilterActive,
                    countries: cs.countries,
                    degreeFilterActive: cs.degreeFilterActive,
                    degrees: cs.degrees,
                    companySizeFilterActive: cs.companySizeFilterActive,
                    enableSalaryFilter: cs.enableSalaryFilter,
                    salaryThresholdMin: cs.salaryThresholdMin,
                    salaryThresholdMax: cs.salaryThresholdMax,
                    selectedCurrency: cs.selectedCurrency,
                    currencyValuesReady: this.entryStore.currencyValues != null
                }
            },
            (data) => {
                this.latestReactionData = data
                if (this.debounceTimer) {
                    clearTimeout(this.debounceTimer)
                }
                this.debounceTimer = setTimeout(() => {
                    if (this.latestReactionData) {
                        this.lastFilterUpdateTime = Date.now()
                        console.log('[DEBUG] UiStore filtering triggered at', new Date(this.lastFilterUpdateTime).toISOString())
                        this.updateFilteredData()
                        if (!this.isStreaming) {
                            this.rebuildBoxStats()
                        }
                    }
                    this.debounceTimer = null
                }, 100)
            },
            { fireImmediately: true }
        )
    }

    updateFilteredData = (): void => {
        const selectedYearNum = parseInt(this.entryStore.selectedYear, 10)
        const parsedData = this.entryStore.parsedDataByYear[selectedYearNum]
        const controlState = this.controlStore.controlState
        
        if (parsedData?.resultSet) {
            this.filteredData[selectedYearNum] = [...parsedData.resultSet]
                .filter(controlState.filterByState.bind(controlState))
        } else {
            this.filteredData[selectedYearNum] = []
        }
    }

    setMobileView = (value: boolean): void => {
        this.isMobileView = value
    }

    setControlPaneOpen = (value: boolean): void => {
        this.controlPaneOpen = value
    }

    private convertSalary(entry: SurveyEntry): number {
        const currencyValues = this.entryStore.currencyValues
        const selectedCurrency = this.controlStore.selectedCurrency
        const rawSalary = entry._salary
        const usdSalary = entry.salaryIsUsd ? rawSalary : rawSalary / (currencyValues?.getRatioByCode(entry.currency) ?? 1)
        const targetCurrencyRatio = currencyValues?.getRatioByCode(selectedCurrency) ?? 1
        return usdSalary * targetCurrencyRatio
    }

    isSalaryInRange(usdValue: number): boolean {
        return usdValue >= this.controlStore.salaryThresholdMin && usdValue <= this.controlStore.salaryThresholdMax
    }

    recordStreamEntry = (entry: SurveyEntry): void => {
        const year = parseInt(this.entryStore.selectedYear, 10)
        if (year !== this.boxStatsYear) {
            this.boxAccumulator.reset()
            this.boxStatsYear = year
            this.isStreaming = true
            this.streamCounter = 0
        }
        if (!this.controlStore.controlState.filterByState(entry)) {
            return
        }
        this.boxAccumulator.add(this.convertSalary(entry))
        this.streamCounter++
        if (this.streamCounter % this.flushInterval === 0) {
            this.boxStats = this.boxAccumulator.toBoxStats()
        }
    }

    finalizeStream = (): void => {
        this.boxStats = this.boxAccumulator.toBoxStats()
        this.isStreaming = false
    }

    private rebuildBoxStatsRequestId = 0

    rebuildBoxStats = (): void => {
        const year = parseInt(this.entryStore.selectedYear, 10)
        this.boxAccumulator.reset()
        this.boxStatsYear = year
        const parsedData = this.entryStore.parsedDataByYear[year]
        const controlState = this.controlStore.controlState
        if (parsedData?.resultSet) {
            const entries = parsedData.resultSet
            const chunkSize = 1000
            let index = 0
            const requestId = ++this.rebuildBoxStatsRequestId
            const processChunk = (): void => {
                if (requestId !== this.rebuildBoxStatsRequestId) return
                const end = Math.min(index + chunkSize, entries.length)
                for (let i = index; i < end; i++) {
                    if (controlState.filterByState(entries[i])) {
                        this.boxAccumulator.add(this.convertSalary(entries[i]))
                    }
                }
                index = end
                if (index < entries.length) {
                    requestAnimationFrame(processChunk)
                } else {
                    this.boxStats = this.boxAccumulator.toBoxStats()
                }
            }
            requestAnimationFrame(processChunk)
        } else {
            this.boxStats = this.boxAccumulator.toBoxStats()
        }
    }

    destroy(): void {
        if (this.reactionDisposer) {
            this.reactionDisposer()
        }
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer)
        }
    }
}

export const uiStore = new UiStore(controlStore, entryStore)

entryStore.setStreamSink((entry) => uiStore.recordStreamEntry(entry))
entryStore.setStreamFinalize(() => uiStore.finalizeStream())