import { AbstractCsvRowMapper } from './AbstractCsvRowMapper'

export class CsvRowMapper2024 extends AbstractCsvRowMapper {
    readonly MAPPER_FOR_YEAR = 2024
    
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