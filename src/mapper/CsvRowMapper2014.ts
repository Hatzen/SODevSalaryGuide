import { AbstractCsvRowMapper } from './AbstractCsvRowMapper'

export class CsvRowMapper2014 extends AbstractCsvRowMapper {
    readonly MAPPER_FOR_YEAR = 2014
    
    readonly SALARY_KEY = 'Including bonus, what is your annual compensation in USD?' // 2011 - 2014
    readonly CURRENCY_KEY = AbstractCsvRowMapper.COLUMN_DONT_EXIST
    readonly GENDER_KEY = 'Gender'
    readonly YEARS_OF_EXPIERIENCE = 'How many years of IT/Programming experience do you have?'
    readonly ABILITIES_KEY = {
        initial: 'Which of the following languages or technologies have you used significantly in the past year?',
        from: 43,
        to: 54
    }
    readonly DEGREE = AbstractCsvRowMapper.COLUMN_DONT_EXIST
    readonly COMPANY_SIZE = 'How many developers are employed at your company?'
    readonly COUNTRY = 'What Country do you live in?'
}