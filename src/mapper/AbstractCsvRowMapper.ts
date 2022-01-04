import CsvRow from '../model/csvRow'
import SurveyEntry, { Currency } from '../model/surveyEntry'

interface ICsvRowMapper {
    readonly SALARY_KEY: string
    readonly CURRENCY_KEY: string
}

export abstract class AbstractCsvRowMapper implements ICsvRowMapper{
    static COLUMN_DONT_EXIST = 'COLUMN_DONT_EXIST'

    abstract readonly SALARY_KEY: string
    abstract readonly CURRENCY_KEY: string

    map (csvRow: CsvRow): SurveyEntry {
        const result = new SurveyEntry()
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
        return result
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