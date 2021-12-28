import { Abilities, Gender } from "./config"

export class Option<T> {
    weight: number = 0.5
    value!: T
    type!: Types
}
// TODO: Use subtypes for options and valid range etc.

export enum Types {
    MultiChoiceCheckbox,
    Slider,
    SingleChoice
}

export default class OptionDefinitions {
    selectedYears!: Option<string[]>
    gender!: Option<Gender>
    expirienceInYears!: Option<number>
    languages!: Option<Abilities[]>
    // TODO:
}