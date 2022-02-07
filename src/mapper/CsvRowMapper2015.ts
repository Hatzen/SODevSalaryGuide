import { AbstractCsvRowMapper } from './AbstractCsvRowMapper'

export class CsvRowMapper2015 extends AbstractCsvRowMapper {
    readonly MAPPER_FOR_YEAR = 2015
    
    readonly SALARY_KEY = 'Salary' // 2015
    readonly CURRENCY_KEY = AbstractCsvRowMapper.COLUMN_DONT_EXIST
    readonly GENDER_KEY = 'Gender'
    readonly YEARS_OF_EXPIERIENCE = 'Years IT / Programming Experience'
    readonly ABILITIES_KEY = AbstractCsvRowMapper.COLUMN_DONT_EXIST
    readonly DEGREE = '101'
    readonly COMPANY_SIZE = AbstractCsvRowMapper.COLUMN_DONT_EXIST
    readonly COUNTRY = '0'
}