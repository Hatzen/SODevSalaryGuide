import { Option } from "./options";

export default interface Config {
    selectedYears: string[]
    gender: Gender
    expirienceInYears: number
    languages: Abilities[]
    // TODO:
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