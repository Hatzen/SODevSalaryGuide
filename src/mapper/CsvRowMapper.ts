import SurveyEntry from "../model/surveyEntry"

export class CsvRowMapper {
    static readonly SALARY_KEY = 'Including bonus, what is your annual compensation' 

    map(row: Papa.ParseStepResult<[key: string]>): SurveyEntry {
        const currentSalary = row.data[CsvRowMapper.SALARY_KEY as any] // TODO: properly
        if (currentSalary != null) {
            const salary = parseInt(currentSalary)
            return new SurveyEntry(salary)
        }
        
        return new SurveyEntry(Math.random() * 4000 + 500)
    }
}