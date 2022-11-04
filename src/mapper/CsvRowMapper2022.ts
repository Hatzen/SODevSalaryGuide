import { AbstractCsvRowMapper } from './AbstractCsvRowMapper'

export class CsvRowMapper2022 extends AbstractCsvRowMapper {
    readonly MAPPER_FOR_YEAR = 2022
    
    readonly SALARY_KEY = 'ConvertedCompYearly'
    readonly CURRENCY_KEY = 'Currency'
    readonly GENDER_KEY = 'Gender'
    readonly YEARS_OF_EXPIERIENCE = 'YearsCode'
    readonly ABILITIES_KEY = 'LanguageHaveWorkedWith'
    readonly DEGREE = 'EdLevel'
    readonly COMPANY_SIZE = 'OrgSize'
    readonly COUNTRY = 'Country'
}