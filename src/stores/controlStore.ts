import { makeAutoObservable } from 'mobx'
import { Gender } from '../model/config'
import SurveyEntry from '../model/surveyEntry'

// https://devlinduldulao.pro/mobx-in-a-nutshell/
export class ControlStore {
    selectedYears: { [year: number]: boolean } = {
        2011: true
    }
    expirienceInYears: [min: number, max:number] = [4, 20]
    genders: Gender[] = [Gender.MALE, Gender.FEMALE, Gender.OTHER]
    abilities: string[] = []
    
    constructor() {
        makeAutoObservable(this)
    }

    /**
     * Computed
     */

    get controlState(): ControlState {
        const selectedYears = this.selectedYears
        const expirienceInYears = this.expirienceInYears
        const genders = this.genders
        const abilities = this.abilities
        return new ControlState({
            selectedYears,
            expirienceInYears,
            genders,
            abilities
        } as ControlState)
    }

    /**
     * Actions
     */

    setYears(selectedYears: { [year: number]: boolean }): void {
        this.selectedYears = selectedYears
    }

    setExp(values: number[]): void {
        this.expirienceInYears = [values[0], values[1]]
    }

    setGenders(value: Gender[]): void {
        this.genders = value
    }

    setAbilities(abilities: string[]): void {
        this.abilities = abilities
    }
}

export enum ControlStateProperties {
    PROPERTY_NAME_SELECTED_YEARS = 'selectedYears',
    PROPERTY_NAME_EXPIRIENCE_IN_YEARS = 'expirienceInYears',
    PROPERTY_NAME_GENDERS = 'genders',
    PROPERTY_NAME_ABILITIES = 'abilities'
}

export class ControlState {
    selectedYears!: { [year: number]: boolean }
    expirienceInYears!: [min: number, max:number]
    genders!: Gender[]
    abilities!: string[]

    constructor (partial: ControlState) {
        Object.assign(this, partial)
    }

    filterByState(entry: SurveyEntry): boolean {
        // debugger
        return this.filterByExpierience(entry)
            && this.filterByAbilities(entry)
            && this.filterByGender(entry)
    }

    private filterByAbilities(entry: SurveyEntry): boolean {
        if (this.abilities.length === 0) {
            return true
        }
        const match = this.abilities.some(
            (ability) => entry.abilities?.indexOf(ability) !== -1)
        /*
        if (this.abilities.length > 0 && entry.abilities != null) {
            console.error("Test:")
            console.error(this.abilities)
            console.error(entry.abilities)
        }
        */
        if (match) {
            // debugger
        }
        return match
    }

    private filterByGender(entry: SurveyEntry): boolean {
        if (this.genders.length === 0) {
            return true
        }
        return this.genders.indexOf(entry.gender!) !== -1
    }

    private filterByExpierience(entry: SurveyEntry): boolean {
        const expirienceInYears = entry.expirienceInYears
        if (expirienceInYears != null) {
            const max = this.expirienceInYears[1]
            const min = this.expirienceInYears[0]
            if (expirienceInYears.max <= max
                || expirienceInYears.min >= min) {
                return true
            }
        }
        return false
    }
}

export default new ControlStore()