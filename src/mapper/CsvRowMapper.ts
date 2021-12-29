import SurveyEntry from "../model/surveyEntry"

export class CsvRowMapper {
    static readonly SALARY_KEY = 'Including bonus, what is your annual compensation in USD?' // 2011 - 2014
    static readonly SALARY_KEY_2016 = 'salary_range' // 2016
    static readonly SALARY_KEY_2017 = 'Salary' // 2015, 2018
    static readonly SALARY_KEY_2018 = 'ConvertedSalary' // 2018
    static readonly SALARY_KEY_2019 = 'CompTotal' // 2019 - 2021 better use ConvertedComp


    map(row: Papa.ParseStepResult<[key: string]>): SurveyEntry {
        debugger
        // TODO: MAke properly. This only works from 2011 - 2014
        let currentSalary = row.data[CsvRowMapper.SALARY_KEY as any] 
        if (currentSalary == null) {
            currentSalary = row.data[CsvRowMapper.SALARY_KEY_2016 as any] 
        }
        /*
        2020 does not appear like this.
        */
        if (currentSalary == null) {
            currentSalary = row.data[CsvRowMapper.SALARY_KEY_2018 as any] 
        }
        
        if (currentSalary == null) {
            currentSalary = row.data[CsvRowMapper.SALARY_KEY_2017 as any]
        }
        if (currentSalary == null) {
            currentSalary = row.data[CsvRowMapper.SALARY_KEY_2019 as any]
        }

        if (currentSalary != null) {
            return new SurveyEntry(this.getValue(currentSalary))
        }
        // 
        return new SurveyEntry(-1)
    }

    private getValue (value: string): number {
        // console.warn("Hurray found salary" + value)
        // E.g. $60,000 - $80,000 or <20000wqe 
        if (typeof value === 'string') {
            if (value.indexOf('<') !== -1) {
                return 10000
            } else if (value.indexOf('$') !== -1 && value.indexOf('-') !== -1) {
                const firstValue = value
                    .replaceAll('$', '')
                    .replaceAll(',', '')
                    .substring(0, value.indexOf('-'))
                return parseInt(firstValue) + 10000
            }
        } 
        try {
            return parseInt(value)
        } catch (error) {
            return -1
        } 
    }
}