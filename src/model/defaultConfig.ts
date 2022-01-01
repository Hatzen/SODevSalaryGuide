import Config, { Abilities, Gender } from '../model/config'

export default class DefaultConfig implements Config {
    selectedYears: string[] = ['2011'] // ['2011', '2012', '2013', '2014', '2015', '2016','2017', '2018', '2019', '2020', '2021'] // ['2017'] //  ['2011', '2012', '2013', '2014', '2015', '2016','2017', '2018', '2019', '2020', '2021']
    gender: Gender = Gender.NONE
    expirienceInYears: number = 4
    languages: Abilities[] = []
}