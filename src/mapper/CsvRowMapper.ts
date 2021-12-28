import SurveyEntry from "../model/surveyEntry"

export class CsvRowMapper {
    static readonly SALARY_KEY = 'Including bonus, what is your annual compensation in USD?' 

    map(row: Papa.ParseStepResult<[key: string]>): SurveyEntry {
        const currentSalary = row.data[CsvRowMapper.SALARY_KEY as any] // TODO: properly
        if (currentSalary != null) {
            // console.warn("Hurray found salary" + currentSalary)
            // E.g. $60,000 - $80,000 or <20000
            if (currentSalary.indexOf('<') !== -1) {
                return new SurveyEntry(10000)
            } else if (currentSalary.indexOf('$') !== -1 && currentSalary.indexOf('-') !== -1) {
                const firstValue = currentSalary
                    .replaceAll('$', '')
                    .replaceAll(',', '')
                    .substring(0, currentSalary.indexOf('-'))
                const value = parseInt(firstValue) + 10000
                return new SurveyEntry(value)
            } else {
                return new SurveyEntry(-1)
            }
        }
        // 
        return new SurveyEntry(-1)
    }
}