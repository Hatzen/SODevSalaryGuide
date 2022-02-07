import { EntryStore } from '../stores/entryStore'
import { Currency } from './currency'
import { Gender } from './gender'

export default class SurveyEntry {
    static entryStore: EntryStore | null = null

    _salary!: number
    isSalaryAlreadyConverted = false
    currency: Currency = Currency.USD

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
    abilities?: string[] // Abilities



    age?: number

    // 2011: Which best describes the size of your company?
    // 2012: Which best describes the size of your company?
    // 2013: How many people work for your company
    // 2014: How many developers are employed at your company
    // 2015: ???
    // 2016: company_size_range
    // 2017: CompanySize
    // 2018: CompanySize
    // 2019: OrgSize
    // 2020: OrgSize
    // 2021: OrgSize
    companySize?: {
        min: number,
        max: number
    }

    // 2011: ??
    // ??
    // TODO: Possible?
    // 2015: 101
    // 2016: education
    // 2017: FormalEducation
    // 2018: FormalEducation
    // 2019: EdLevel
    // 2020: EdLevel
    // 2021: EdLevel
    highestDegree?: string

    // 2011: What Country or Region do you live in?
    // 2012: What Country or Region do you live in?
    // 2013: What Country or Region do you live in?
    // 2014: What Country do you live in?
    // 2015: 0 / 1
    // 2016: country
    // 2017: Country
    // 2018: Country
    // 2019: Country
    // 2020: Country
    // 2021: Country
    country?: string

    get salary(): number {
        const entryStore = SurveyEntry.entryStore
        if (this.isSalaryAlreadyConverted !== false && entryStore != null) {
            // TODO: Especially this is incorrect when using converted salary is not it?
            // TODO: Why this will only work on 2018 and lead to very strange results...
            return this._salary / entryStore.currencyValues.getRatioByCode(this.currency)
        }
        return this._salary
    }
    get isValid(): boolean {
        return this._salary > 0
    }
}
