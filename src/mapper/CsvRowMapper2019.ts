import { AbstractCsvRowMapper } from './AbstractCsvRowMapper'

export class CsvRowMapper2019 extends AbstractCsvRowMapper {
    readonly SALARY_KEY = 'ConvertedComp' // 2019 - 2021
    readonly CURRENCY_KEY = 'CurrencyDesc'
    readonly GENDER_KEY = 'Gender'
    readonly YEARS_OF_EXPIERIENCE = 'YearsCode'
}