import { Abilities, Gender } from './config'

export default class SurveyEntry {
    _salary!: number
    currency: Currency = Currency.USD

    // TODO:
    // 2011-2014: How many years of IT/Programming experience do you have?
    // 2015: Years IT / Programming Experience   ; Acutally bad headers
    // 2016: experience_range and midpoint
    // 2017: YearsProgram
    // 2018: YearsCoding,YearsCodingProf
    // 2019: YearsCode,Age1stCode,YearsCodePro
    // 2020: YearsCode,YearsCodePro
    // 2021: YearsCode,YearsCodePro
    expirienceInYears?: {
        min: number,
        max: number
    }
    // 2011 - 2013: ???
    // 2014: Gender
    // ...
    // 2020: Gender
    gender?: Gender
    // 2011: What type of project are you developing? => #30 - #43
    // 2012: What type of project are you developing? #22
    //    // Which languages are you proficient in? => #23 - #37
    // 2013: Which of the following languages or technologies have you used significantly in the past year? => 57 - 70
    // 2014: Which of the following languages or technologies have you used significantly in the past year? => 43 - 54
    // 2015: ??
    // 2016: tech_do => With ; seperated
    // 2017: HaveWorkedLanguage => ;
    // 2018 - 2020: LanguageWorkedWith => ;
    // 2021: LanguageHaveWorkedWith => ;
    abilities?: Abilities



    age?: number

    // 2011: Which best describes the size of your company?
    // TODO: ....
    // 2020: OrgSize
    companySize?: number

    // TODO: Possible?
    // 2019: EdLevel
    highestDegree?: string


    country?: string

    get salary(): number {
        return this._salary
        // TODO: Especially this is incorrect when using converted salary is not it?
        // TODO: Why this will only work on 2018 and lead to very strange results...
        // return this._salary / Store.currencyValues.getRatioByCode(this.currency)
    }
    get isValid(): boolean {
        return this._salary > 0
    }
}

// https://bankenverband.de/service/waehrungsrechner-bdb-link/wahrungen-und-abkurzungen/
export enum Currency {
    USD = 'USD',
    EUR = 'EUR',
    JPY = 'JPY',
    MXN = 'MXN',
    GBP = 'GBP'
    // TODO: Complete..
}