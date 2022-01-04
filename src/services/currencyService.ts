import CurrencyValues from '../model/currencyValues'

// https://freecurrencyapi.net/api/v2/latest?apikey=d3626290-68c5-11ec-abd0-4f2669673a10&base_currency=USD

// TODO: Get average 2019-01-01 and 2019-12-31
// https://freecurrencyapi.net/api/v2/historical?date_from=2019-12-31&date_to=2019-12-31&apikey=d3626290-68c5-11ec-abd0-4f2669673a10
export default class CurrencyService {
    private readonly baseUrl = 'https://freecurrencyapi.net/api/v2/'

    getCurrencies (): Promise<CurrencyValues> {
        return fetch(this.baseUrl + 'latest?apikey=d3626290-68c5-11ec-abd0-4f2669673a10&base_currency=USD')
            .then(response => {
                return response.json().then(data => {
                    const cur = new CurrencyValues()
                    return Object.assign(cur, data)
                })
            })
            .catch(error => console.error(error))
    }

}