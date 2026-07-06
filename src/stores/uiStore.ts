import { action, makeObservable, observable, reaction } from 'mobx'
import type { ControlStore } from './controlStore'
import type { EntryStore } from './entryStore'
import SurveyEntry from '../model/surveyEntry'
import controlStore from './controlStore'
import entryStore from './entryStore'
import { Gender } from '../model/gender'

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
}

export class UiStore {

    filteredData: { [year: number]: SurveyEntry[] } = {}
    lastFilterUpdateTime = 0
    isMobileView = false
    controlPaneOpen = false

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
            updateFilteredData: action,
            setMobileView: action,
            setControlPaneOpen: action,
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
                    enableSalaryFilter: cs.enableSalaryFilter
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