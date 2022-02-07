import { AbstractCsvRowMapper } from './AbstractCsvRowMapper'

export class CsvRowMapper2011 extends AbstractCsvRowMapper {
    readonly MAPPER_FOR_YEAR = 2011
    
    readonly SALARY_KEY = 'Including bonus, what is your annual compensation in USD?' // 2011 - 2014
    readonly CURRENCY_KEY = AbstractCsvRowMapper.COLUMN_DONT_EXIST
    readonly GENDER_KEY = AbstractCsvRowMapper.COLUMN_DONT_EXIST // 2011 - 2013
    readonly YEARS_OF_EXPIERIENCE = 'How many years of IT/Programming experience do you have?'
    readonly ABILITIES_KEY = {
        initial: 'What type of project are you developing?',
        from: 30,
        to: 43
    }
    readonly DEGREE = AbstractCsvRowMapper.COLUMN_DONT_EXIST
    readonly COMPANY_SIZE = 'Which best describes the size of your company?'
    readonly COUNTRY = 'What Country or Region do you live in?'
}