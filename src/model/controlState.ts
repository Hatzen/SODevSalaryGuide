import { Gender } from './gender'
import SurveyEntry from './surveyEntry'

export default class ControlState {
    selectedYears!: { [year: number]: boolean }
    expirienceInYears!: [min: number, max:number]
    genders!: Gender[]
    abilities!: string[]

    gendersFilterActive = false
    abilitiesFilterActive = false
    expirienceFilterActive = false

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
        if (this.abilities.length === 0 || this.abilitiesFilterActive === false) {
            return true
        }
        return this.abilities.some(
            (ability) => entry.abilities?.indexOf(ability) !== -1)
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
}
