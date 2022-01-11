import { Gender } from './gender'
import SurveyEntry from './surveyEntry'

export default class ControlState {
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
        if (true) {
            return true
        }
        /*
        const expirienceInYears = entry.expirienceInYears
        if (expirienceInYears != null) {
            const max = this.expirienceInYears[1]
            const min = this.expirienceInYears[0]
            if (expirienceInYears.max <= max
                || expirienceInYears.min >= min) {
                return true
            }
        }
        return false*/
    }
}
