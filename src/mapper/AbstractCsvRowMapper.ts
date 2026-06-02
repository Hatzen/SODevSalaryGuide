import CsvRow from '../model/csvRow'
import { Currency } from '../model/currency'
import { Gender } from '../model/gender'
import SurveyEntry from '../model/surveyEntry'
import StackOverflowCsvReader from '../services/stackOverflowCsvReader'

type ColumnList = { initial: string, from: number, to: number}

interface ICsvRowMapper {
    readonly SALARY_KEY: string
    readonly CURRENCY_KEY: string
    readonly GENDER_KEY: string
    readonly YEARS_OF_EXPIERIENCE: string
    readonly ABILITIES_KEY: string | ColumnList
    readonly DEGREE: string
    readonly COMPANY_SIZE: string
    readonly COUNTRY: string
}

// TODO: Currently only the first chunk of data will produce a result as we only have the header there..
// TODO: We need to fix these chunked data first..
// TODO: Espacially 2015 header wont be set for all chunks as "salary" was added manually
export abstract class AbstractCsvRowMapper implements ICsvRowMapper{
    static COLUMN_DONT_EXIST = 'COLUMN_DONT_EXIST'

    // Sets to distinct values and map to filter values with single response.
    static educations: Map<string, number> = new Map()
    static countries: Map<string, number> = new Map()
    static genders: Set<string> = new Set()
    static years: Set<string> = new Set()
    static abilities: Map<string, number> = new Map()
    static companySize: Map<string, number> = new Map()

    abstract readonly SALARY_KEY: string
    abstract readonly CURRENCY_KEY: string
    abstract readonly GENDER_KEY: string
    abstract readonly YEARS_OF_EXPIERIENCE: string
    abstract readonly ABILITIES_KEY: string | ColumnList
    abstract readonly DEGREE: string
    abstract readonly COMPANY_SIZE: string
    abstract readonly COUNTRY: string

    abstract readonly MAPPER_FOR_YEAR: number

    map (csvRow: CsvRow): SurveyEntry {
        const result = new SurveyEntry()
        this.setSalary(csvRow, result)
        this.setGender(csvRow, result)
        this.setYearsOfExpirience(csvRow, result)
        this.setAbilities(csvRow, result)
        this.setCompanySize(csvRow, result)
        this.setCountry(csvRow, result)
        this.setDegree(csvRow, result)
        return result
    }
    
    protected setAbilities(csvRow: CsvRow, result: SurveyEntry): void {
        const abilities = (result.abilities || [])
        // If single column abilities are seperated with semicolon.
        if (typeof this.ABILITIES_KEY === 'string') {
            const abilitiesSeperatedBySemicolon = csvRow[this.ABILITIES_KEY]
            abilitiesSeperatedBySemicolon?.split(';').forEach(abi => {
                this.addKeyAndupdateKeyCount(abi, abilities)
            })
        } else {
            // if multiple columns the columns after inital are unnamed.
            const columnList = this.ABILITIES_KEY as ColumnList
            let ability = csvRow[columnList.initial]
            this.addKeyAndupdateKeyCount(ability, abilities)
            if (abilities == null) {
                return
            }
            for (let i = columnList.from; i <= columnList.to; i++) {
                ability = csvRow[StackOverflowCsvReader.UNNAMED_COLUMN_PREFIX + i]
                this.addKeyAndupdateKeyCount(ability, abilities)
            }
        }
        result.abilities = abilities
    }

    static clearDistinctValues(): void {
        AbstractCsvRowMapper.educations.clear()
        AbstractCsvRowMapper.countries.clear()
        AbstractCsvRowMapper.genders.clear()
        AbstractCsvRowMapper.years.clear()
        AbstractCsvRowMapper.abilities.clear()
        AbstractCsvRowMapper.companySize.clear()
    }

    private addKeyAndupdateKeyCount(key: string, targetList: string[]): void {
        if (key == null) {
            return
        }
        const id = this.valueAsId(key)
        const invalidValues = ['response', '', 'none', 'other', 'others', 'otherpleasespecify']
        if (invalidValues.indexOf(id) !== -1) {
            return
        }

        const newValue = (AbstractCsvRowMapper.abilities.get(id) || 0) + 1
        AbstractCsvRowMapper.abilities.set(id, newValue)
        targetList.push(id)
    }

    protected valueAsId(dirtyString: string): string {
        // Keep only alphabetical chars.
        // TODO: This is wrong for C++, C#, VB++ etc.
        return dirtyString.replace(/[^a-z0-9]/gi,'').toLowerCase()
    }

    protected setDegree(csvRow: CsvRow, result: SurveyEntry): void {
        const degree = csvRow[this.DEGREE]
        
        if (degree == null) {
            return
        }
        let id = this.valueAsId(degree)
        // TODO: Proper filter invalid values.
        const invalidValues = ['response', '', 'none', 'other', 'others', 'otherpleasespecify', 'na']
        if (invalidValues.indexOf(id) !== -1) {
            return
        }
        id = id.indexOf('selftaught') !== -1 ? 'selftaught' : id
        id = id.indexOf('onthejob') !== -1 ? 'onthejob' : id


        const newValue = (AbstractCsvRowMapper.educations.get(id) ?? 0) + 1
        AbstractCsvRowMapper.educations.set(id, newValue)

        result.highestDegree = id
    }

    protected setCountry(csvRow: CsvRow, result: SurveyEntry): void {
        const country = csvRow[this.COUNTRY]
        
        if (country == null) {
            return
        }
        const id = this.valueAsId(country)
        // TODO: Proper filter invalid values.
        const invalidValues = ['response', '', 'none', 'other', 'others', 'otherpleasespecify']
        if (invalidValues.indexOf(id) !== -1) {
            return
        }

        const newValue = (AbstractCsvRowMapper.countries.get(id) ?? 0) + 1
        AbstractCsvRowMapper.countries.set(id, newValue)

        result.country = id
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
        if (yearsOfExpirience.indexOf('-') !== -1 || yearsOfExpirience.indexOf('to') !== -1) {
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

    protected setCompanySize(csvRow: CsvRow, result: SurveyEntry): void {
        const companySize = csvRow[this.COMPANY_SIZE]
        
        if (companySize == null) {
            // When column is not defined it is null.
            return
        }

        const id = this.valueAsId(companySize)
        const invalidValues = ['response', '', 'none', 'other', 'others', 'otherpleasespecify']
        if (invalidValues.indexOf(id) !== -1) {
            return
        }

        const newValue = (AbstractCsvRowMapper.companySize.get(id) ?? 0) + 1
        AbstractCsvRowMapper.companySize.set(id, newValue)

        let mappedResult
        // https://stackoverflow.com/questions/10003683/how-can-i-extract-a-number-from-a-string-in-javascript
        // thenum = "foo3bar5".match(/\d+/)[0] // "3"
        if (companySize.indexOf('-') !== -1 || companySize.indexOf('to') !== -1) {
            const match = companySize.match(/\d+/)
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
            const match = companySize.match(/\d+/)
            if (match === null) {
                return
            }
            const min = parseInt(match[0])
            mappedResult = {
                min,
                max: min
            }
        }
        
        result.companySize = mappedResult
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
            const salaryValue = this.getSalaryValue(salary)
            if (salaryValue !== -1 && Math.abs(salaryValue) > 0) {
                result._salary = Math.abs(salaryValue)
            }
        }

        const currency = csvRow[this.CURRENCY_KEY]
        if (currency != null) {
            result.currency = this.getCurrency(currency)
        }
    }

    protected getCurrency(value: string): Currency {
        const upperValue = value.toUpperCase()
        if (upperValue.includes('EUR')) return Currency.EUR
        if (upperValue.includes('YEN') || upperValue.includes('JPY')) return Currency.JPY
        if (upperValue.includes('POUNDS') || upperValue.includes('GBP')) return Currency.GBP
        if (upperValue.includes('US DOLLAR') || upperValue.includes('USD')) return Currency.USD
        if (upperValue.includes('CAD')) return Currency.CAD
        if (upperValue.includes('AUD')) return Currency.AUD
        if (upperValue.includes('CHF')) return Currency.CHF
        if (upperValue.includes('CNY')) return Currency.CNY
        if (upperValue.includes('INR')) return Currency.INR
        if (upperValue.includes('SEK')) return Currency.SEK
        if (upperValue.includes('NZD')) return Currency.NZD
        if (upperValue.includes('BRL')) return Currency.BRL
        if (upperValue.includes('SGD')) return Currency.SGD
        if (upperValue.includes('HKD')) return Currency.HKD
        if (upperValue.includes('NOK')) return Currency.NOK
        if (upperValue.includes('ZAR')) return Currency.ZAR
        if (upperValue.includes('RUB')) return Currency.RUB
        if (upperValue.includes('TRY')) return Currency.TRY
        if (upperValue.includes('KRW')) return Currency.KRW
        if (upperValue.includes('IDR')) return Currency.IDR
        if (upperValue.includes('MYR')) return Currency.MYR
        if (upperValue.includes('PHP')) return Currency.PHP
        if (upperValue.includes('THB')) return Currency.THB
        if (upperValue.includes('PLN')) return Currency.PLN
        if (upperValue.includes('CZK')) return Currency.CZK
        if (upperValue.includes('ILS')) return Currency.ILS
        if (upperValue.includes('CLP')) return Currency.CLP
        if (upperValue.includes('AED')) return Currency.AED
        if (upperValue.includes('SAR')) return Currency.SAR
        if (upperValue.includes('TWD')) return Currency.TWD
        if (upperValue.includes('MXN')) return Currency.MXN

        return Currency.USD
    }

    protected containsValue (value: string, find: string): boolean {
        return value.toUpperCase().indexOf(find) !== -1
    }

    protected getSalaryValue (value: string): number {
        //
        // console.warn("Hurray found salary" + value)
        // E.g. $60,000 - $80,000 or <20000wqe
        if (typeof value === 'string') {
            if (value.indexOf('<') !== -1) {
                return 10000 // <20k consider as 10k in average
        } else if (value.indexOf('$') !== -1 && value.indexOf('-') !== -1) {
            const firstValue = value
                .split('$').join('')
                .split(',').join('')
                .substring(0, value.indexOf('-'))
            return parseInt(firstValue) + 10000 // 20-40k => average 30k
        }
        }
        try {
            let result = parseInt(value)
            if (isNaN(result)) {
                return -1
            }
            //
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
    /*
    protected getSalaryValue (value: string): number {
        // E.g. $60,000 - $80,000 or <20000wqe
        if (typeof value === 'string') {
            if (value.indexOf('<') !== -1) {
                const match = value.match(/\d+/)
                return match ? parseInt(match[0]) : 10000
            } else if (value.indexOf('$') !== -1 && value.indexOf('-') !== -1) {
                const firstValue = value
                    .split('$').join('')
                    .split(',').join('')
                    .substring(0, value.indexOf('-'))
                return parseInt(firstValue) + 10000 // 20-40k => average 30k
            }
        }
        try {
            const result = parseInt(value)
            if (isNaN(result)) {
                return -1
            }
            // If the value is greater 500k and it is "even" consider it as wrong decimal input
            if (result > 500000 && (result % 10000 === 0)) {
                return result / 100
            }
            return result
        } catch (error) {
            return -1
        }
    }*/
}