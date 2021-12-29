import Papa from "papaparse"
import CsvRow from "../model/csvRow"

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

    startWorkerForYear (year: string, consumer: (row: Papa.ParseStepResult<CsvRow>) => void, completed: () => void): void {
        const config = {
            download: true,
            worker: true,
            dynamicTyping: true,
            delimiter: ',',
            header: true,
            step: consumer,
            complete: completed
        }
        const chunkCountForYear = this.chunkCount[year]
        for (let chunk = 1; chunk <= chunkCountForYear; chunk++) {
            const fileUrl = this.baseUrl + '/' + this.generateFileName(year, chunk)
            // TODO: All files get downloaded, but it seems only 4 Workers get ever started...
            //   More probably the missing header in the chunked files lead to errors. 
            Papa.parse(fileUrl, config);
        }
    }

    generateFileName(year: string, chunk: number): string {
        return year + '-chunk-' + chunk + '.csv'
    }

    get baseUrl(): string {
        return location.protocol + '//' + location.host + location.pathname.substring(0, location.pathname.length - 1);
    }
}