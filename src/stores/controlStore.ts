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

    companySize: [min: number, max:number] = [1, 100000]
    countries: string[] = []
    degrees: string[] = []
    
    gendersFilterActive = false
    abilitiesFilterActive = false
    expirienceFilterActive = false
    
    companySizeFilterActive = false
    degreeFilterActive = false
    countriesFilterActive = false
    
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

        const degrees = this.degrees
        const companySize = this.companySize
        const countries = this.countries

        const gendersFilterActive = this.gendersFilterActive
        const abilitiesFilterActive = this.abilitiesFilterActive
        const expirienceFilterActive= this.expirienceFilterActive

        const companySizeFilterActive = this.companySizeFilterActive
        const degreeFilterActive = this.degreeFilterActive
        const countriesFilterActive = this.countriesFilterActive

        return new ControlState({
            selectedYears,
            expirienceInYears,
            genders,
            abilities,
            degrees,
            companySize,
            countries,
            gendersFilterActive,
            abilitiesFilterActive,
            expirienceFilterActive,
            companySizeFilterActive,
            degreeFilterActive,
            countriesFilterActive
        } as ControlState)
    }

    get companySizeValues (): { min: number, max: number, steps: number } {
        // TODO: Inject entry store and calcualte resonable values
        return {
            min: 1,
            max: 100000,
            steps: 10
        }
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

    setGenders(value: Gender): void {
        // let convertedValue = value.toLowerCase()
        //convertedValue = convertedValue.charAt(0).toUpperCase() + convertedValue.slice(1)
        const convertedValue: Gender = (Gender as any)[value as any]
        const index = this.genders.indexOf(convertedValue)
        if (index !== -1) {
            this.genders.splice(index, 1)
        } else {
            this.genders.push(convertedValue)
        }
    }
    
    setAbilities(abilities: string[]): void {
        this.abilities = abilities
    }
    
    setCompanySize(values: number[]): void {
        this.companySize = [values[0], values[1]]
    }

    setCountries(countries: string[]): void {
        this.countries = countries
    }

    setDegrees(degrees: string[]): void {
        this.degrees = degrees
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

    setCompanySizeFilterActive(companySizeFilterActive: boolean): void {
        this.companySizeFilterActive = companySizeFilterActive
    }

    setDegreeFilterActive(degreeFilterActive: boolean): void {
        this.degreeFilterActive = degreeFilterActive
    }
    
    setCountriesFilterActive(countriesFilterActive: boolean): void {
        this.countriesFilterActive = countriesFilterActive
    }
}

export default new ControlStore()