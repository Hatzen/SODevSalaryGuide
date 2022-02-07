import { AbstractCsvRowMapper } from './AbstractCsvRowMapper'

export class CsvRowMapper2019 extends AbstractCsvRowMapper {
    readonly MAPPER_FOR_YEAR = 2019
    
    readonly SALARY_KEY = 'ConvertedComp' // 2019 - 2021
    readonly CURRENCY_KEY = 'CurrencyDesc'
    readonly GENDER_KEY = 'Gender'
    readonly YEARS_OF_EXPIERIENCE = 'YearsCode'
    readonly ABILITIES_KEY = 'LanguageWorkedWith'
    readonly DEGREE = 'EdLevel'
    readonly COMPANY_SIZE = 'OrgSize'
    readonly COUNTRY = 'Country'
}