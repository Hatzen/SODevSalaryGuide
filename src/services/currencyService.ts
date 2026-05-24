import CurrencyValues from '../model/currencyValues'

// Default currency values (USD = 1, EUR = 0.9, GBP = 0.8, etc.)
const DEFAULT_CURRENCY_VALUES: CurrencyValues = {
  query: {
    base_currency: 'USD',
    timestamp: Math.floor(Date.now() / 1000)
  },
  data: {
    USD: 1,
    EUR: 0.9,
    GBP: 0.8,
    CAD: 1.3,
    AUD: 1.4,
    JPY: 110,
    CHF: 0.9,
    CNY: 6.5,
    INR: 75
    // Add more as needed
  },
  getRatioByCode(currency: any): number {
    return this.data[currency] || 1
  }
};

// https://freecurrencyapi.net/api/v2/latest?apikey=d3626290-68c5-11ec-abd0-4f2669673a10&base_currency=USD

// TODO: Get average 2019-01-01 and 2019-12-31
// https://freecurrencyapi.net/api/v2/historical?date_from=2019-12-31&date_to=2019-12-31&apikey=d3626290-68c5-11ec-abd0-4f2669673a10
export default class CurrencyService {
    private readonly baseUrl = 'https://freecurrencyapi.net/api/v2/'

    getCurrencies (): Promise<CurrencyValues> {
        return fetch(this.baseUrl + 'latest?apikey=d3626290-68c5-11ec-abd0-4f2669673a10&base_currency=USD')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json().then(data => {
                    const cur = new CurrencyValues()
                    // Assign the response data to the currency values object
                    cur.query = {
                        base_currency: data.query.base_currency,
                        timestamp: data.query.timestamp
                    }
                    cur.data = data.data
                    return cur
                })
            })
            .catch(error => {
                console.warn('Failed to fetch currency data, using default values:', error)
                // Return default values instead of failing
                return DEFAULT_CURRENCY_VALUES
            })
    }
}