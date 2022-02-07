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
    static educations: Map<any, number> = new Map()
    static countries: Map<any, number> = new Map()
    static genders: Set<any> = new Set()
    static years: Set<any> = new Set()
    static abilities: Map<any, number> = new Map()

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
            if (salaryValue < 10000) {
                return
            }
            result._salary = salaryValue
        }

        const currency = csvRow[this.CURRENCY_KEY]
        if (currency != null) {
            result.currency = this.getCurrency(currency)
        }
        
        if (result.salary > 250000) {
            // console.error('Bad ratio: ' + currency + ' with value ' + result._salary)
            result._salary = -1
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
        //
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
}