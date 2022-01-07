import { AbstractCsvRowMapper } from './AbstractCsvRowMapper'

export class CsvRowMapper2017 extends AbstractCsvRowMapper {
    readonly SALARY_KEY =  'Salary'
    readonly CURRENCY_KEY = 'Currency'
    readonly GENDER_KEY = 'Gender'
    readonly YEARS_OF_EXPIERIENCE = 'YearsProgram'
    readonly ABILITIES_KEY = 'HaveWorkedLanguage'
}