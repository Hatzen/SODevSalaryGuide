import { AbstractCsvRowMapper } from "./AbstractCsvRowMapper"

export class CsvRowMapper2016 extends AbstractCsvRowMapper {
    readonly SALARY_KEY =  'salary_range' // 2016
    readonly CURRENCY_KEY = AbstractCsvRowMapper.COLUMN_DONT_EXIST
}