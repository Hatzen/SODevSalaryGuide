import { action, makeObservable, observable, reaction } from 'mobx'
import type { ControlStore } from './controlStore'
import type { EntryStore } from './entryStore'
import SurveyEntry from '../model/surveyEntry'
import controlStore from './controlStore'
import entryStore from './entryStore'

export class UiStore {

    filteredData: { [year: number]: SurveyEntry[] } = {}

    private readonly controlStore: ControlStore
    private readonly entryStore: EntryStore
    private reactionDisposer: (() => void) | null = null
    private lastFilterUpdateTime = 0
    private static readonly minUpdateIntervalMs = 500

    constructor(controlStore: ControlStore, entryStore: EntryStore) {
        this.controlStore = controlStore
        this.entryStore = entryStore
        
        makeObservable(this, {
            filteredData: observable,
            updateFilteredData: action,
        })

        this.initReactions()
    }

    private initReactions(): void {
        // Create a debounced reaction that updates when data or filter state changes
        this.reactionDisposer = reaction(
            () => {
                const years = Object.keys(this.entryStore.parsedDataByYear)
                const cs = this.controlStore
                return years.map(y => ({
                    year: parseInt(y, 10),
                    overallEntryCount: this.entryStore.parsedDataByYear[parseInt(y, 10)].overallEntryCount,
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
                }))
            },
            () => {
                const now = Date.now()
                if (now - this.lastFilterUpdateTime > UiStore.minUpdateIntervalMs) {
                    this.lastFilterUpdateTime = now
                    this.updateFilteredData()
                }
            },
            { fireImmediately: true }
        )
    }

    updateFilteredData = (): void => {
        Object.keys(this.entryStore.parsedDataByYear).forEach((yearStr: string) => {
            const year = parseInt(yearStr, 10)
            const parsedData = this.entryStore.parsedDataByYear[year]
            const controlState = this.controlStore.controlState
            this.filteredData[year] = parsedData.resultSet
                .filter(controlState.filterByState.bind(controlState))
        })
    }

    destroy(): void {
        if (this.reactionDisposer) {
            this.reactionDisposer()
        }
    }
}

export const uiStore = new UiStore(controlStore, entryStore)