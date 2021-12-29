import { AbstractCsvRowMapper } from "./AbstractCsvRowMapper"

export class CsvRowMapper2018 extends AbstractCsvRowMapper {
    readonly SALARY_KEY = 'ConvertedSalary' // 2018
    readonly CURRENCY_KEY = 'Currency'
}