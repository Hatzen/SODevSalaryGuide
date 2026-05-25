import { action, makeObservable, observable, observe } from 'mobx'
import type { ControlStore } from './controlStore'
import type { EntryStore } from './entryStore'
import SurveyEntry from '../model/surveyEntry'
import controlStore from './controlStore'
import entryStore from './entryStore'

export class UiStore {

    filteredData: { [year: number]: SurveyEntry[] } = {}

    private static readonly renderPeriodInMs = 3000
    private readonly controlStore: ControlStore
    private readonly entryStore: EntryStore
    
    private timeoutId!: number
    private dataChanged = true

    constructor(controlStore: ControlStore, entryStore: EntryStore) {
        this.controlStore = controlStore
        this.entryStore = entryStore
        
        makeObservable(this, {
            filteredData: observable,
            udpateFilteredData: action,
        })

        this.initStore()

        this.resetRenderSchedule()
    }

    private initStore(): void {
        
        observe(this.entryStore.parsedDataByYear, this.handleChanges.bind(this))
    }

    private handleChanges(): void {
        //
        this.dataChanged = true
        this.resetRenderSchedule()
    }

    private resetRenderSchedule (): void {
        window.clearInterval(this.timeoutId)
        this.timeoutId = window.setInterval(this.udpateFilteredData.bind(this), UiStore.renderPeriodInMs)
    }

    // TODO: Maybe do in worker? https://medium.com/launch-school/what-are-web-workers-4a0e1ded7a67
    udpateFilteredData (): void {
        this.dataChanged = false
        Object.keys(this.entryStore.parsedDataByYear).forEach((yearStr: string) => {
            const year = parseInt(yearStr, 10)
            const parsedData = this.entryStore.parsedDataByYear[year]
            const controlState = this.controlStore.controlState
            this.filteredData[year] = parsedData.resultSet
                .filter(controlState.filterByState.bind(controlState))
        })
    }
}

export const uiStore = new UiStore(controlStore, entryStore)