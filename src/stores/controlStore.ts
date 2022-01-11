import { makeAutoObservable } from 'mobx'
import ControlState from '../model/controlState'
import { Gender } from '../model/gender'

// https://devlinduldulao.pro/mobx-in-a-nutshell/
export class ControlStore {
    selectedYears: { [year: number]: boolean } = {
        2011: true
    }
    expirienceInYears: [min: number, max:number] = [4, 20]
    genders: Gender[] = [Gender.MALE, Gender.FEMALE, Gender.OTHER]
    abilities: string[] = []
    
    gendersFilterActive = false
    abilitiesFilterActive = false
    expirienceFilterActive = false
    
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
        const gendersFilterActive = this.gendersFilterActive
        const abilitiesFilterActive = this.abilitiesFilterActive
        const expirienceFilterActive= this.expirienceFilterActive
        return new ControlState({
            selectedYears,
            expirienceInYears,
            genders,
            abilities,
            gendersFilterActive,
            abilitiesFilterActive,
            expirienceFilterActive
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

    setGendersFilterActive(gendersFilterActive: boolean): void {
        this.gendersFilterActive = gendersFilterActive
    }

    setAbilitiesFilterActive(abilitiesFilterActive: boolean): void {
        this.abilitiesFilterActive = abilitiesFilterActive
    }
    
    setExpirienceFilterActive(expirienceFilterActive: boolean): void {
        this.expirienceFilterActive = expirienceFilterActive
    }
}

export default new ControlStore()