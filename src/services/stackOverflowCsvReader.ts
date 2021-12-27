import Papa from "papaparse"

export default class StackOverflowCsvReader {

    readonly startYear = '2011'
    readonly endYear = '2021'

    private readonly chunkCount: { [year: string]: number } = {
        '2011': 1,
        '2012': 1,
        '2013': 1,
        '2014': 1,
        '2015': 3,
        '2016': 8,
        '2017': 10,
        '2018': 20,
        '2019': 20,
        '2020': 10,
        '2021': 9
    }

    startWorkerForYear (year: string, consumer: (row: Papa.ParseStepResult<[key: string]>) => void): void {
        const config = {
            download: true,
            worker: true,
            dynamicTyping: true,
            delimiter: ',',
            header: true,
            step: consumer,
            complete: function() {
                console.log("All data read for year " + year);
            }
        }
        const chunkCountForYear = this.chunkCount[year]
        for (let chunk = 1; chunk <= chunkCountForYear; chunk++) {
            const fileUrl = this.baseUrl + '/' + this.generateFileName(year, chunk)
            Papa.parse(fileUrl, config);
        }
    }

    generateFileName(year: string, chunk: number): string {
        return year + '-' + chunk + '.csv'
    }

    get baseUrl(): string {
        return location.protocol + '//' + location.host;
    }
}