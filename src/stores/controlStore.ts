import { makeAutoObservable } from 'mobx'
import { Gender } from '../model/config'
import SurveyEntry from '../model/surveyEntry'

// https://devlinduldulao.pro/mobx-in-a-nutshell/
export class ControlStore {
    
    controlState: ControlState

    constructor() {
        makeAutoObservable(this)
        this.controlState = new ControlState({
            selectedYears: {
                2011: true
            },
            expirienceInYears: {
                min: 0,
                max: 40
            },
            genders: [Gender.MALE, Gender.FEMALE, Gender.OTHER],
            abilities: []
        })
    }

    /**
     * Actions
     */

    setControlState (controlState: ControlState): void {
        this.controlState = controlState
    }
    
    setControlStateValue(property: string, newValue: any): void {
        this.controlState.selectedYears[property as any] = newValue
    }
}

export class ControlState {
    selectedYears!: { [year: number]: boolean }
    expirienceInYears!: {
        min: number,
        max: number
    }
    genders!: Gender[]
    abilities!: string[]

    constructor (partial: Partial<ControlState>) {
        Object.assign(this, partial)
    }

    filterByState(entry: SurveyEntry): boolean {
        
        return this.filterByGender(entry) &&
            this.filterByExpierience(entry) &&
            this.filterByAbilities(entry)
    }

    private filterByAbilities(entry: SurveyEntry): boolean {
        return this.abilities.some(
            (ability) => entry.abilities?.indexOf(ability) !== -1
        )
    }

    private filterByGender(entry: SurveyEntry): boolean {
        return this.genders.indexOf(entry.gender!) !== -1
    }

    private filterByExpierience(entry: SurveyEntry): boolean {
        const expirienceInYears = entry.expirienceInYears
        if (expirienceInYears != null) {
            if (expirienceInYears.max <= this.expirienceInYears.max
                || expirienceInYears.min >= this.expirienceInYears.min) {
                return true
            }
        }
        return false
    }
}

export default new ControlStore()