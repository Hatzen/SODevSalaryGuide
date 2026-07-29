import { Gender } from './gender'
import SurveyEntry from './surveyEntry'
import { Currency } from './currency'

export default class ControlState {
    selectedYear!: string
    expirienceInYears!: [min: number, max:number]
    genders!: Gender[]
    abilities!: string[]
    companySize: [min: number | null, max: number | null] = [null, null]
    countries: string[] = []
    degrees: string[] = []
    selectedCurrency: Currency = Currency.EUR

    gendersFilterActive = false
    abilitiesFilterActive = false
    expirienceFilterActive = false
      
    companySizeFilterActive = false
    degreeFilterActive = false
    countriesFilterActive = false

    enableSalaryFilter = true

    constructor (partial: ControlState) {
        Object.assign(this, partial)
    }

    filterByState(entry: SurveyEntry): boolean {
        return this.filterBySalary(entry)
            && this.filterByExpierience(entry)
            && this.filterByAbilities(entry)
            && this.filterByGender(entry)
            && this.filterByCompanySize(entry)
            && this.filterByCountries(entry)
            && this.filterByDegree(entry)
    }

    private filterBySalary(entry: SurveyEntry): boolean {
        if (!this.enableSalaryFilter) {
            return true
        }
        const rawSalary = entry._salary
        const entryStore = SurveyEntry.entryStore
        const currencyValues = entryStore?.currencyValues
        const usdSalary = entry.salaryIsUsd ? rawSalary : rawSalary / (currencyValues?.getRatioByCode(entry.currency) ?? 1)
        return usdSalary >= 10000 && usdSalary <= 250000
    }

    private filterByAbilities(entry: SurveyEntry): boolean {
        if (this.abilities.length === 0 || this.abilitiesFilterActive === false) {
            return true
        }
        return this.abilities.some(
            (ability) => entry.abilities?.indexOf(ability) !== -1)
    }
    
    private filterByCountries(entry: SurveyEntry): boolean {
        if (this.countries.length === 0 || this.countriesFilterActive === false) {
            return true
        }
        return this.countries.indexOf(entry.country!) !== -1
    }
    
    private filterByDegree(entry: SurveyEntry): boolean {
        if (this.degrees.length === 0 || this.degreeFilterActive === false) {
            return true
        }
        return this.degrees.indexOf(entry.highestDegree!) !== -1
    }

    private filterByGender(entry: SurveyEntry): boolean {
        if (this.genders.length === 0 || this.gendersFilterActive === false) {
            return true
        }
        return this.genders.indexOf(entry.gender!) !== -1
    }

    private filterByExpierience(entry: SurveyEntry): boolean {
        if (this.expirienceFilterActive === false) {
            return true
        }
        const expirienceInYears = entry.expirienceInYears
        if (expirienceInYears != null) {
            const max = this.expirienceInYears[1]
            const min = this.expirienceInYears[0]
            if (expirienceInYears.min >= min
                && expirienceInYears.max <= max) {
                return true
            }
        }
        return false
    }
    
    private filterByCompanySize(entry: SurveyEntry): boolean {
        if (this.companySizeFilterActive === false) {
            return true
        }
        const companySize = entry.companySize
        if (companySize != null) {
            const filterMin = this.companySize[0]
            const filterMax = this.companySize[1]
            const entryMin = companySize.min
            const entryMax = companySize.max
            if (filterMin === null && filterMax === null) {
                return true
            } else if (filterMin !== null && filterMax !== null) {
                return entryMax >= filterMin && entryMin <= filterMax
            } else if (filterMin !== null && filterMax === null) {
                return entryMax >= filterMin
            } else if (filterMin === null && filterMax !== null) {
                return entryMin <= filterMax
            }
        }
        return false
    }
}
