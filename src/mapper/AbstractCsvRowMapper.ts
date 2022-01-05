import { Gender } from '../model/config'
import CsvRow from '../model/csvRow'
import SurveyEntry, { Currency } from '../model/surveyEntry'

interface ICsvRowMapper {
    readonly SALARY_KEY: string
    readonly CURRENCY_KEY: string
    readonly GENDER_KEY: string
    readonly YEARS_OF_EXPIERIENCE: string
}

export abstract class AbstractCsvRowMapper implements ICsvRowMapper{
    static COLUMN_DONT_EXIST = 'COLUMN_DONT_EXIST'

    static genders: Set<any> = new Set()
    static years: Set<any> = new Set()

    abstract readonly SALARY_KEY: string
    abstract readonly CURRENCY_KEY: string
    abstract readonly GENDER_KEY: string
    abstract readonly YEARS_OF_EXPIERIENCE: string

    map (csvRow: CsvRow): SurveyEntry {
        const result = new SurveyEntry()
        this.setSalary(csvRow, result)
        this.setGender(csvRow, result)
        this.setYearsOfExpirience(csvRow, result)
        return result
    }
    
    protected setYearsOfExpirience(csvRow: CsvRow, result: SurveyEntry): void {
        const yearsOfExpirience = csvRow[this.YEARS_OF_EXPIERIENCE]
        
        if (yearsOfExpirience == null) {
            // When column is not defined it is null.
            return
        }
        // TODO: Remove
        AbstractCsvRowMapper.years.add(yearsOfExpirience)

        let mappedResult
        // https://stackoverflow.com/questions/10003683/how-can-i-extract-a-number-from-a-string-in-javascript
        // thenum = "foo3bar5".match(/\d+/)[0] // "3"
        if (yearsOfExpirience.indexOf('-') || yearsOfExpirience.indexOf('to')) {
            const match = yearsOfExpirience.match(/\d+/)
            if (match === null) {
                return
            }
            const min = parseInt(match[0])
            const max = parseInt(match[1])
            mappedResult = {
                min,
                max
            }
        } else {
            const match = yearsOfExpirience.match(/\d+/)
            if (match === null) {
                return
            }
            const min = parseInt(match[0])
            mappedResult = {
                min,
                max: min
            }
        }
        
        result.expirienceInYears = mappedResult
        
    }

    protected setGender(csvRow: CsvRow, result: SurveyEntry): void {
        const gender = csvRow[this.GENDER_KEY]

        if (gender == null) {
            // When column is not defined it is null.
            return
        }
        // TODO: Remove
        AbstractCsvRowMapper.genders.add(gender)
        
        // TODO: Handle as array? As there are answers with multiple genders..
        let mappedGender
        if (gender.indexOf('Female') !== -1 || gender.indexOf('Woman') !== -1) {
            mappedGender = Gender.FEMALE
        }
        if (gender.indexOf('Male') !== -1 || gender.indexOf('Man') !== -1) {
            mappedGender = Gender.MALE
        }
        if (gender.indexOf('Non-binary') !== -1 || gender.indexOf('gender') !== -1) {
            mappedGender = Gender.OTHER
        }
        result.gender = mappedGender
    }

    protected setSalary(csvRow: CsvRow, result: SurveyEntry): void {
        const salary = csvRow[this.SALARY_KEY]
        if (salary != null) {
            result._salary = this.getSalaryValue(salary)
        }

        const currency = csvRow[this.CURRENCY_KEY]
        if (currency != null) {
            result.currency = this.getCurrency(currency)
        }
        
        if (result._salary > 150000) {
            // console.error('Bad ratio: ' + currency + ' with value ' + result._salary)
        }
    }

    protected getCurrency(value: string): Currency {
        if (this.containsValue(value, 'EUR')) {
            return Currency.EUR
        }
        if (this.containsValue(value, 'YEN')) {
            return Currency.JPY
        }
        if (this.containsValue(value, 'POUNDS')) {
            return Currency.GBP
        }
        if (this.containsValue(value, 'US DOLLAR')) {
            return Currency.USD
        }
        
        // TODO: Add all currencies

        // console.error('Cannot map ' + value + ' to currency. Setting to default USD.')
        return Currency.USD

    }

    protected containsValue (value: string, find: string): boolean {
        return value.toUpperCase().indexOf(value) !== -1
    }

    protected getSalaryValue (value: string): number {
        // debugger
        // console.warn("Hurray found salary" + value)
        // E.g. $60,000 - $80,000 or <20000wqe
        if (typeof value === 'string') {
            if (value.indexOf('<') !== -1) {
                return 10000 // <20k consider as 10k in average
            } else if (value.indexOf('$') !== -1 && value.indexOf('-') !== -1) {
                const firstValue = value
                    .replaceAll('$', '')
                    .replaceAll(',', '')
                    .substring(0, value.indexOf('-'))
                return parseInt(firstValue) + 10000 // 20-40k => average 30k
            }
        }
        try {
            let result = parseInt(value)
            if (isNaN(result)) {
                return -1
            }
            // debugger
            // TODO: Make these manipulation readable for the user.
            // If the value is greater 500k and it is "even" consider it as wrong decimal input
            if (result > 500000 && (result % 10000 === 0)) {
                result /= 100
            }
            // dont consider income over 1 million as loan..
            if (result > 1000000) {
                result = -1
            }
            return result
        } catch (error) {
            return -1
        }
    }
}