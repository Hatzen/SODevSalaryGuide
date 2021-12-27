import Config, { Abilities, Gender } from '../model/config'

export default class DefaultConfig implements Config {
    selectedYears: string[] = ['2011', '2012']
    gender: Gender = Gender.NONE
    expirienceInYears: number = 4
    languages: Abilities[] = []
}