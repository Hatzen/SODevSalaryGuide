import { action, makeObservable, observable, reaction } from 'mobx'
import type { ControlStore } from './controlStore'
import type { EntryStore } from './entryStore'
import SurveyEntry from '../model/surveyEntry'
import controlStore from './controlStore'
import entryStore from './entryStore'

export class UiStore {

    filteredData: { [year: number]: SurveyEntry[] } = {}
    lastFilterUpdateTime = 0

    private readonly controlStore: ControlStore
    private readonly entryStore: EntryStore
    private reactionDisposer: (() => void) | null = null

    constructor(controlStore: ControlStore, entryStore: EntryStore) {
        this.controlStore = controlStore
        this.entryStore = entryStore
        
        makeObservable(this, {
            filteredData: observable,
            lastFilterUpdateTime: observable,
            updateFilteredData: action,
        })

        this.initReactions()
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
            () => {
                this.lastFilterUpdateTime = Date.now()
                console.log('[DEBUG] UiStore filtering triggered at', new Date(this.lastFilterUpdateTime).toISOString())
                this.updateFilteredData()
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

    destroy(): void {
        if (this.reactionDisposer) {
            this.reactionDisposer()
        }
    }
}

export const uiStore = new UiStore(controlStore, entryStore)