import { makeAutoObservable } from 'mobx'
import ControlState from '../model/controlState'
import { Gender } from '../model/gender'
import { Currency } from '../model/currency'

// https://devlinduldulao.pro/mobx-in-a-nutshell/
export class ControlStore {
    selectedYear = '2025'
    expirienceInYears: [min: number, max:number] = [4, 20]
    genders: Gender[] = [Gender.MALE, Gender.FEMALE, Gender.OTHER]
    abilities: string[] = []

    companySize: [min: number | null, max: number | null] = [null, null]
    countries: string[] = []
    degrees: string[] = []
    selectedCurrency: Currency = Currency.EUR
    language: 'en' | 'de' = 'en'

    gendersFilterActive = false
    abilitiesFilterActive = false
    expirienceFilterActive = false

    companySizeFilterActive = false
    degreeFilterActive = false
    countriesFilterActive = false

    enableSalaryFilter = true
    salaryThresholdMin = 10000
    salaryThresholdMax = 250000

    pendingState: any = null

    constructor() {
        makeAutoObservable(this)
    }

    /**
     * Computed
     */

    get controlState(): ControlState {
        const selectedYear = this.selectedYear
        const expirienceInYears = this.expirienceInYears
        const genders = this.genders
        const abilities = this.abilities

        const degrees = this.degrees
        const companySize = this.companySize
        const countries = this.countries
        const selectedCurrency = this.selectedCurrency

        const gendersFilterActive = this.gendersFilterActive
        const abilitiesFilterActive = this.abilitiesFilterActive
        const expirienceFilterActive = this.expirienceFilterActive

        const companySizeFilterActive = this.companySizeFilterActive
        const degreeFilterActive = this.degreeFilterActive
        const countriesFilterActive = this.countriesFilterActive
        const enableSalaryFilter = this.enableSalaryFilter
        const salaryThresholdMin = this.salaryThresholdMin
        const salaryThresholdMax = this.salaryThresholdMax

        return new ControlState({
            selectedYear,
            expirienceInYears,
            genders,
            abilities,
            degrees,
            companySize,
            countries,
            selectedCurrency,
            gendersFilterActive,
            abilitiesFilterActive,
            expirienceFilterActive,
            companySizeFilterActive,
            degreeFilterActive,
            countriesFilterActive,
            enableSalaryFilter,
            salaryThresholdMin,
            salaryThresholdMax
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

    setSelectedYear(year: string): void {
        this.selectedYear = year
    }

    setExp(values: number[]): void {
        this.expirienceInYears = [values[0], values[1]]
    }

    setGenders(value: Gender): void {
        // let convertedValue = value.toLowerCase()
        //convertedValue = convertedValue.charAt(0).toUpperCase() + convertedValue.slice(1)
        const convertedValue: Gender = Gender[value]
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

    setCompanySizeFromMin(min: number | null): void {
        this.companySize = [min, this.companySize[1]]
    }

    setCompanySizeFromMax(max: number | null): void {
        this.companySize = [this.companySize[0], max]
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

    setEnableSalaryFilter(enableSalaryFilter: boolean): void {
        this.enableSalaryFilter = enableSalaryFilter
    }

    setSalaryThresholdMin(salaryThresholdMin: number): void {
        this.salaryThresholdMin = salaryThresholdMin
    }

    setSalaryThresholdMax(salaryThresholdMax: number): void {
        this.salaryThresholdMax = salaryThresholdMax
    }

    setSelectedCurrency(currency: Currency): void {
        this.selectedCurrency = currency
    }

    setLanguage(language: 'en' | 'de'): void {
        this.language = language
    }

    loadPendingState(): void {
        if (this.pendingState) {
            const state = this.pendingState
            this.pendingState = null
            this.selectedYear = state.selectedYear ?? this.selectedYear
            if (state.expirienceInYears !== undefined) this.expirienceInYears = state.expirienceInYears
            if (state.genders !== undefined) this.genders = state.genders
            if (state.abilities !== undefined) this.abilities = state.abilities
            if (state.companySize !== undefined) this.companySize = state.companySize
            if (state.countries !== undefined) this.countries = state.countries
            if (state.degrees !== undefined) this.degrees = state.degrees
            if (state.selectedCurrency !== undefined) this.selectedCurrency = state.selectedCurrency
            if (state.language !== undefined) this.language = state.language
            if (state.gendersFilterActive !== undefined) this.gendersFilterActive = state.gendersFilterActive
            if (state.abilitiesFilterActive !== undefined) this.abilitiesFilterActive = state.abilitiesFilterActive
            if (state.expirienceFilterActive !== undefined) this.expirienceFilterActive = state.expirienceFilterActive
            if (state.companySizeFilterActive !== undefined) this.companySizeFilterActive = state.companySizeFilterActive
            if (state.degreeFilterActive !== undefined) this.degreeFilterActive = state.degreeFilterActive
            if (state.countriesFilterActive !== undefined) this.countriesFilterActive = state.countriesFilterActive
            if (state.enableSalaryFilter !== undefined) this.enableSalaryFilter = state.enableSalaryFilter
            if (state.salaryThresholdMin !== undefined) this.salaryThresholdMin = state.salaryThresholdMin
            if (state.salaryThresholdMax !== undefined) this.salaryThresholdMax = state.salaryThresholdMax
        }
    }

    getSessionState(): any {
        return {
            selectedYear: this.selectedYear,
            expirienceInYears: this.expirienceInYears,
            genders: this.genders,
            abilities: this.abilities,
            companySize: this.companySize,
            countries: this.countries,
            degrees: this.degrees,
            selectedCurrency: this.selectedCurrency,
            language: this.language,
            gendersFilterActive: this.gendersFilterActive,
            abilitiesFilterActive: this.abilitiesFilterActive,
            expirienceFilterActive: this.expirienceFilterActive,
            companySizeFilterActive: this.companySizeFilterActive,
            degreeFilterActive: this.degreeFilterActive,
            countriesFilterActive: this.countriesFilterActive,
            enableSalaryFilter: this.enableSalaryFilter,
            salaryThresholdMin: this.salaryThresholdMin,
            salaryThresholdMax: this.salaryThresholdMax
        }
    }

    loadFromSessionState(state: any): void {
        if (state.selectedYear !== undefined) {
            this.selectedYear = state.selectedYear
        }
        if (state.expirienceInYears !== undefined) this.expirienceInYears = state.expirienceInYears
        if (state.genders !== undefined) this.genders = state.genders
        if (state.abilities !== undefined) this.abilities = state.abilities
        if (state.companySize !== undefined) this.companySize = state.companySize
        if (state.countries !== undefined) this.countries = state.countries
        if (state.degrees !== undefined) this.degrees = state.degrees
        if (state.selectedCurrency !== undefined) this.selectedCurrency = state.selectedCurrency
        if (state.language !== undefined) this.language = state.language
        if (state.gendersFilterActive !== undefined) this.gendersFilterActive = state.gendersFilterActive
        if (state.abilitiesFilterActive !== undefined) this.abilitiesFilterActive = state.abilitiesFilterActive
        if (state.expirienceFilterActive !== undefined) this.expirienceFilterActive = state.expirienceFilterActive
        if (state.companySizeFilterActive !== undefined) this.companySizeFilterActive = state.companySizeFilterActive
        if (state.degreeFilterActive !== undefined) this.degreeFilterActive = state.degreeFilterActive
        if (state.countriesFilterActive !== undefined) this.countriesFilterActive = state.countriesFilterActive
        if (state.enableSalaryFilter !== undefined) this.enableSalaryFilter = state.enableSalaryFilter
        if (state.salaryThresholdMin !== undefined) this.salaryThresholdMin = state.salaryThresholdMin
        if (state.salaryThresholdMax !== undefined) this.salaryThresholdMax = state.salaryThresholdMax
    }
}

export default new ControlStore()