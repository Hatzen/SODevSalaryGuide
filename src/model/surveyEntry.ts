export default class SurveyEntry {
    _salary!: number
    currency: Currency = Currency.USD

    get salary(): number {
        return this._salary
        // TODO: Why this will only work on 2018 and lead to very strange results...
        // return this._salary / Store.currencyValues.getRatioByCode(this.currency)
    }
    get isValid(): boolean {
        return this._salary > 0
    }
}

// https://bankenverband.de/service/waehrungsrechner-bdb-link/wahrungen-und-abkurzungen/
export enum Currency {
    USD = 'USD',
    EUR = 'EUR',
    JPY = 'JPY',
    MXN = 'MXN',
    GBP = 'GBP'
    // TODO: Complete..
}