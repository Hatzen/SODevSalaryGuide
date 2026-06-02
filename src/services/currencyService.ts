import CurrencyValues from '../model/currencyValues'
import { Currency } from '../model/currency'

// Default currency values (USD = 1, EUR = 0.9, GBP = 0.8, etc.)
const DEFAULT_CURRENCY_VALUES: CurrencyValues = {
    query: {
        base_currency: 'USD',
        timestamp: Math.floor(Date.now() / 1000)
    },
    data: {
        [Currency.USD]: 1,
        [Currency.EUR]: 0.9,
        [Currency.GBP]: 0.8,
        [Currency.CAD]: 1.3,
        [Currency.AUD]: 1.4,
        [Currency.JPY]: 110,
        [Currency.CHF]: 0.9,
        [Currency.CNY]: 6.5,
        [Currency.INR]: 75,
        [Currency.SEK]: 11,
        [Currency.NZD]: 1.6,
        [Currency.BRL]: 5.2,
        [Currency.SGD]: 1.35,
        [Currency.HKD]: 7.8,
        [Currency.NOK]: 10.5,
        [Currency.ZAR]: 18,
        [Currency.RUB]: 90,
        [Currency.TRY]: 30,
        [Currency.KRW]: 1300,
        [Currency.IDR]: 15000,
        [Currency.MYR]: 4.2,
        [Currency.PHP]: 55,
        [Currency.THB]: 35,
        [Currency.PLN]: 4.2,
        [Currency.CZK]: 22,
        [Currency.ILS]: 3.7,
        [Currency.CLP]: 850,
        [Currency.AED]: 3.7,
        [Currency.SAR]: 3.75,
        [Currency.TWD]: 31
    },
    getRatioByCode(currency: Currency): number {
        return this.data[currency] ?? 1
    }
};

// https://freecurrencyapi.net/api/v2/latest?apikey=d3626290-68c5-11ec-abd0-4f2669673a10&base_currency=USD
// Note: For CORS in development, use a proxy or browser extension. In production, consider server-side proxy.
export default class CurrencyService {
    private readonly baseUrl = 'https://api.freecurrencyapi.com/v1/latest?apikey=d3626290-68c5-11ec-abd0-4f2669673a10&base_currency=USD'

    getCurrencies (): Promise<CurrencyValues> {
        return fetch(this.baseUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json().then(data => {
                    const cur = new CurrencyValues()
                    cur.query = {
                        base_currency: data.query?.base_currency ?? 'USD',
                        timestamp: data.query?.timestamp ?? Math.floor(Date.now() / 1000)
                    }
                    cur.data = data.data ?? {}
                    return cur
                })
            })
            .catch(error => {
                console.warn('Failed to fetch currency data, using default values:', error)
                return DEFAULT_CURRENCY_VALUES
            })
    }
}