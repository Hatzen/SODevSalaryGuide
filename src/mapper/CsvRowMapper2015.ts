import { AbstractCsvRowMapper } from "./AbstractCsvRowMapper"

export class CsvRowMapper2015 extends AbstractCsvRowMapper {
    readonly SALARY_KEY = 'Salary' // 2015
    readonly CURRENCY_KEY = AbstractCsvRowMapper.COLUMN_DONT_EXIST
}