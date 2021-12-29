export default class SurveyEntry {
    salary: number
    currency: Currency = Currency.USD

    constructor (salary: number) {
        this.salary = salary
    }
}

// https://bankenverband.de/service/waehrungsrechner-bdb-link/wahrungen-und-abkurzungen/
export enum Currency {
    USD = 'USD',
    EUR = 'EUR',
    JPY = 'JPY',
    MXN = 'MXN'
}