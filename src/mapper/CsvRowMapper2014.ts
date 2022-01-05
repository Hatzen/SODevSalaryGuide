import { AbstractCsvRowMapper } from './AbstractCsvRowMapper'

export class CsvRowMapper2014 extends AbstractCsvRowMapper {
    readonly SALARY_KEY = 'Including bonus, what is your annual compensation in USD?' // 2011 - 2014
    readonly CURRENCY_KEY = AbstractCsvRowMapper.COLUMN_DONT_EXIST
    readonly GENDER_KEY = 'Gender'
    readonly YEARS_OF_EXPIERIENCE = 'How many years of IT/Programming experience do you have?'
}