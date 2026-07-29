import { AbstractCsvRowMapper } from './AbstractCsvRowMapper'

export class CsvRowMapper2023 extends AbstractCsvRowMapper {
    readonly SALARY_ALREADY_CONVERTED = true
    readonly MAPPER_FOR_YEAR = 2023
    
    readonly SALARY_KEY = 'ConvertedCompYearly'
    readonly CURRENCY_KEY = 'Currency'
    // missing
    readonly GENDER_KEY = 'gender'
    readonly YEARS_OF_EXPIERIENCE = 'YearsCode'
    readonly ABILITIES_KEY = 'LanguageHaveWorkedWith'
    readonly DEGREE = 'EdLevel'
    readonly COMPANY_SIZE = 'OrgSize'
    readonly COUNTRY = 'Country'
}


