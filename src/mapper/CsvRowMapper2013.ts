import { AbstractCsvRowMapper } from './AbstractCsvRowMapper'

export class CsvRowMapper2013 extends AbstractCsvRowMapper {
    readonly MAPPER_FOR_YEAR = 2013
    
    readonly SALARY_KEY = 'Including bonus, what is your annual compensation in USD?' // 2011 - 2014
    readonly CURRENCY_KEY = AbstractCsvRowMapper.COLUMN_DONT_EXIST
    readonly GENDER_KEY = AbstractCsvRowMapper.COLUMN_DONT_EXIST // 2011 - 2013
    readonly YEARS_OF_EXPIERIENCE = 'How many years of IT/Programming experience do you have?'
    readonly ABILITIES_KEY = {
        initial: 'Which of the following languages or technologies have you used significantly in the past year?',
        from: 57,
        to: 70
    }
    readonly DEGREE = AbstractCsvRowMapper.COLUMN_DONT_EXIST
    readonly COMPANY_SIZE = 'How many people work for your company'
    readonly COUNTRY = 'What Country or Region do you live in?'
}