import { Currency } from './currency'

export default class CurrencyValues {
    query!: {
        base_currency: string // e.g. "USD"
        timestamp: number// e.g. 1632911490,
    }
    data!: { [currencyWith3Letters: string]: number }
    /*
    e.g.
        "JPY":110.432,
        "BGN":1.661,
        "CZK":21.517,
        "DKK":6.305,
        "GBP":0.729,
        "HUF":296.729,
        "PLN":3.831,
        "RON":4.195,
        "SEK":8.619,
        "CHF":0.924,
        "ISK":127.627,
        "NOK":8.703,
        "HRK":6.339,
        "RUB":73.415,
    */

    getRatioByCode(currency: Currency): number {
        return this.data[currency]
    }
}