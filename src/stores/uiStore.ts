import { makeAutoObservable, observable, observe } from 'mobx'
import SurveyEntry from '../model/surveyEntry'
import { ControlStore } from './controlStore'
import {  EntryStore } from './entryStore'

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
        
        makeAutoObservable(this)

        // observable(this.filteredData)

        // observe(this.entryStore.parsedData.overallEntryCount, this.handleChanges.bind(this))
        // observe(this.controlStore.controlState, this.handleChanges.bind(this))
        this.resetRenderSchedule()
    }

    private handleChanges(): void {
        this.dataChanged = true
        this.resetRenderSchedule()
    }

    private resetRenderSchedule (): void {
        window.clearTimeout(this.timeoutId)
        this.timeoutId = window.setTimeout(this.udpateFilteredData.bind(this), UiStore.renderPeriodInMs)
    }

    private udpateFilteredData (): void {
        if (this.dataChanged === true) {
            this.dataChanged = false
            Object.keys(this.entryStore.parsedDataByYear).forEach((year: any) => {
                const parsedData = this.entryStore.parsedDataByYear[year]
                this.filteredData[year] = parsedData.resultSet
                    .filter(this.controlStore.controlState.filterByState) // TODO: bind the state?
            })
        }
    }

}