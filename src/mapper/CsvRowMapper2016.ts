import { AbstractCsvRowMapper } from './AbstractCsvRowMapper'

export class CsvRowMapper2016 extends AbstractCsvRowMapper {
    readonly MAPPER_FOR_YEAR = 2016
    
    readonly SALARY_KEY =  'salary_range' // 2016
    readonly CURRENCY_KEY = AbstractCsvRowMapper.COLUMN_DONT_EXIST
    readonly GENDER_KEY = 'Gender'
    readonly YEARS_OF_EXPIERIENCE = 'experience_range' // or use midpoint
    readonly ABILITIES_KEY = 'tech_do'
    readonly DEGREE = 'education'
    readonly COMPANY_SIZE = 'company_size_range'
    readonly COUNTRY = 'country'
}