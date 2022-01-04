import { makeAutoObservable } from 'mobx'

// https://devlinduldulao.pro/mobx-in-a-nutshell/
export class ControlStore {
    
    controlState: ControlState

    constructor() {
        makeAutoObservable(this)
        this.controlState = {
            selectedYears: {
                2011: true
            }
        }
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

}

export default new ControlStore()