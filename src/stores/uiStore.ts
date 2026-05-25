import { action, makeObservable, observable, observe } from 'mobx'
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
        
        // makeAutoObservable(this)
        this.initStore()

        this.resetRenderSchedule()
    }

    private initStore(): void {
        
        makeObservable(this, {
            filteredData: observable,
            udpateFilteredData: action,
        })

        // observable(this.filteredData)

        // observe(this.entryStore.parsedData.overallEntryCount, this.handleChanges.bind(this))
        // observe(this.entryStore.parsedDataByYear, 2011, this.handleChanges.bind(this))
        // observe(this.entryStore, 'parsedDataByYear', this.handleChanges) //.bind(this)
        // observe(this.controlStore, 'controlState', this.handleChanges)
        observe(this.entryStore.parsedDataByYear, this.handleChanges.bind(this))
        // observe(this.controlStore.controlState, this.handleChanges.bind(this))
        /*
        reaction(
            () => this.entryStore.parsedDataByYear,
            flag => {
                this.handleChanges()
            }
        )
        reaction(
            () => this.controlStore.controlState,
            flag => {
                this.handleChanges()
            }
        )
        */
        // observe(this.controlStore.controlState, this.handleChanges.bind(this))
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
        // // TODO: this.dataChanged only changes when applying observer.. Which is failing in constructor as objects are not initialized???
        // For better performance only render every 3 seconds (to avoid rendering every 20ms and freeze ui) and only when anything changed.
        //if (this.dataChanged === true) {
        this.dataChanged = false
        Object.keys(this.entryStore.parsedDataByYear).forEach((year: any) => {
            const parsedData = this.entryStore.parsedDataByYear[year]
            const controlState = this.controlStore.controlState
            this.filteredData[year] = parsedData.resultSet
                .filter(controlState.filterByState.bind(controlState))
        })
        //}
    }

}