import { Gender } from './gender'
import SurveyEntry from './surveyEntry'

export default class ControlState {
    selectedYears!: { [year: number]: boolean }
    expirienceInYears!: [min: number, max:number]
    genders!: Gender[]
    abilities!: string[]
    companySize: [min: number, max:number] = [1, 100000]
    countries: string[] = []
    degrees: string[] = []

    gendersFilterActive = false
    abilitiesFilterActive = false
    expirienceFilterActive = false
    
    companySizeFilterActive = false
    degreeFilterActive = false
    countriesFilterActive = false
    

    constructor (partial: ControlState) {
        Object.assign(this, partial)
    }

    filterByState(entry: SurveyEntry): boolean {
        return this.filterByExpierience(entry)
            && this.filterByAbilities(entry)
            && this.filterByGender(entry)
            && this.filterByCompanySize(entry)
            && this.filterByCountries(entry)
            && this.filterByDegree(entry)
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
            if (expirienceInYears.max <= max
                || expirienceInYears.min >= min) {
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
            const max = this.companySize[1]
            const min = this.companySize[0]
            if (companySize.max <= max
                || companySize.min >= min) {
                return true
            }
        }
        return false
    }
}
