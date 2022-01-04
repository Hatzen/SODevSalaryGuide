import CsvRow from '../model/csvRow'
import SurveyEntry from '../model/surveyEntry'
import { AbstractCsvRowMapper } from './AbstractCsvRowMapper'
import { CsvRowMapper2018 } from './CsvRowMapper2018'
import { CsvRowMapper2015 } from './CsvRowMapper2015'
import { CsvRowMapper2016 } from './CsvRowMapper2016'
import { CsvRowMapper2011 } from './CsvRowMapper2011'
import { CsvRowMapper2019 } from './CsvRowMapper2019'

export class CsvRowMapper {
    static readonly INVALID_ENTRY = new SurveyEntry()
    private readonly MAPPER_2011 = new CsvRowMapper2011()
    private readonly MAPPER_2015 = new CsvRowMapper2015()
    private readonly MAPPER_2016 = new CsvRowMapper2016()
    private readonly MAPPER_2018 = new CsvRowMapper2018()
    private readonly MAPPER_2019 = new CsvRowMapper2019()

    private year: number

    constructor (year: number) {
        this.year = year
        CsvRowMapper.INVALID_ENTRY._salary = -1
    }

    map(row: Papa.ParseStepResult<CsvRow>): SurveyEntry {
        const csvRow = row.data
        let mapper: AbstractCsvRowMapper
        switch (this.year) {
        case 2011:
        case 2012:
        case 2013:
        case 2014:
            mapper = this.MAPPER_2011
            break
        case 2015:
        case 2017: // TODO: 2017 has "Currency" 2015 not..
            mapper = this.MAPPER_2015
            break
        case 2016:
            mapper = this.MAPPER_2016
            break
        case 2018:
            mapper = this.MAPPER_2018
            break
        case 2019:
        case 2020:
        case 2021:
            mapper = this.MAPPER_2019
            break
        default:
            // TODO: This can not happen?
            return CsvRowMapper.INVALID_ENTRY
        }
        return mapper.map(csvRow)
    }

}