import { action, makeAutoObservable, makeObservable, observable } from 'mobx'
import { Gender } from '../model/config'
import SurveyEntry from '../model/surveyEntry'

// https://devlinduldulao.pro/mobx-in-a-nutshell/
export class ControlStore {
    
    controlState: ControlState = new ControlState({
        selectedYears: {
            2011: true
        },
        expirienceInYears: {
            min: 4,
            max: 20
        },
        genders: [Gender.MALE, Gender.FEMALE, Gender.OTHER],
        abilities: []
    })

    constructor() {
        // makeAutoObservable(this)

        
        makeObservable(this, {
            controlState: observable,
            setExp: action,
        })
        /*
        this.setControlState(new ControlState({
            selectedYears: {
                2011: true
            },
            expirienceInYears: {
                min: 4,
                max: 20
            },
            genders: [Gender.MALE, Gender.FEMALE, Gender.OTHER],
            abilities: []
        }))*/
    }

    /**
     * Actions
     */

    setControlState (controlState: ControlState): void {
        Object.assign(this.controlState, controlState)
    }
    
    setControlStateValue(property: string, newValue: any): void {
        this.controlState.selectedYears[property as any] = newValue
    }

    setExp(values: number[]): void {
        console.log('setExp')
        console.log(values)
        this.controlState.expirienceInYears.min = values[0]
        this.controlState.expirienceInYears.max = values[1]
        console.log(this.controlState)
        /*
        this.controlState.expirienceInYears = {
            min: values[0],
            max: values[1]
        }
        */
    }

    setGenders(value: Gender[]): void {
        this.controlState.genders = value
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
        // debugger
        return this.filterByExpierience(entry)
            // this.filterByGender(entry) &&
            //&&
            //this.filterByAbilities(entry)
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