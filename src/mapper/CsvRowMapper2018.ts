import { AbstractCsvRowMapper } from './AbstractCsvRowMapper'

export class CsvRowMapper2018 extends AbstractCsvRowMapper {
    readonly MAPPER_FOR_YEAR = 2018
    
    readonly SALARY_KEY = 'ConvertedSalary' // 2018
    readonly CURRENCY_KEY = 'Currency'
    readonly GENDER_KEY = 'Gender'
    readonly YEARS_OF_EXPIERIENCE = 'YearsCoding'
    readonly ABILITIES_KEY = 'LanguageWorkedWith'
    readonly DEGREE = 'FormalEducation'
    readonly COMPANY_SIZE = 'CompanySize'
    readonly COUNTRY = 'Country'
}