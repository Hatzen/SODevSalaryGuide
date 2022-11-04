import CsvRow from '../model/csvRow'
import SurveyEntry from '../model/surveyEntry'
import { AbstractCsvRowMapper } from './AbstractCsvRowMapper'
import { CsvRowMapper2018 } from './CsvRowMapper2018'
import { CsvRowMapper2015 } from './CsvRowMapper2015'
import { CsvRowMapper2016 } from './CsvRowMapper2016'
import { CsvRowMapper2011 } from './CsvRowMapper2011'
import { CsvRowMapper2019 } from './CsvRowMapper2019'
import { CsvRowMapper2014 } from './CsvRowMapper2014'
import { CsvRowMapper2017 } from './CsvRowMapper2017'
import { CsvRowMapper2021 } from './CsvRowMapper2021'
import { CsvRowMapper2022 } from './CsvRowMapper2022'
import { CsvRowMapper2012 } from './CsvRowMapper2012'
import { CsvRowMapper2013 } from './CsvRowMapper2013'

export class CsvRowMapper {
    static readonly INVALID_ENTRY = new SurveyEntry()
    private readonly MAPPER_2011 = new CsvRowMapper2011()
    private readonly MAPPER_2012 = new CsvRowMapper2012()
    private readonly MAPPER_2013 = new CsvRowMapper2013()
    private readonly MAPPER_2014 = new CsvRowMapper2014()
    private readonly MAPPER_2015 = new CsvRowMapper2015()
    private readonly MAPPER_2016 = new CsvRowMapper2016()
    private readonly MAPPER_2017 = new CsvRowMapper2017()
    private readonly MAPPER_2018 = new CsvRowMapper2018()
    private readonly MAPPER_2019 = new CsvRowMapper2019()
    private readonly MAPPER_2021 = new CsvRowMapper2021()
    private readonly MAPPER_2022 = new CsvRowMapper2022()

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
            mapper = this.MAPPER_2011
            break
        case 2012:
            mapper = this.MAPPER_2012
            break
        case 2013:
            mapper = this.MAPPER_2013
            break
        case 2014:
            mapper = this.MAPPER_2014
            break
        case 2015:
            mapper = this.MAPPER_2015
            break
        case 2016:
            mapper = this.MAPPER_2016
            break
        case 2017: // TODO: 2017 has "Currency" 2015 not..
            mapper = this.MAPPER_2017
            break
        case 2018:
            mapper = this.MAPPER_2018
            break
        case 2019:
        case 2020:
            mapper = this.MAPPER_2019
            break
        case 2021:
            mapper = this.MAPPER_2021
            break
        case 2022:
            mapper = this.MAPPER_2022
            break
        default:
            // TODO: This can not happen?
            return CsvRowMapper.INVALID_ENTRY
        }
        return mapper.map(csvRow)
    }

}