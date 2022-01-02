export default interface Config {
    selectedYears: string[]
    gender: Gender[]
    expirienceInYears: ExpirienceRange
    languages: Abilities[]
    // TODO: Inflation and working hours button etc.
}

export interface ExpirienceRange {
    min: number
    max: number
}

export enum Abilities {
    JAVA,
    C,
    SQL
    // TODO: Complete..
}

export enum Gender {
    MALE,
    FEMALE,
    OTHER,
    NONE
}