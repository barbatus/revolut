import 'whatwg-fetch';

const URL = 'https://openexchangerates.org/api/latest.json';
const API_KEY = '4e43bd2d19e9468bafa3ec23b42528c0';
const BASE = 'USD';

export interface Rates {
  [index: string]: number;
}

class RatesResp {
  rates: Rates;
}

export class ExchangeRates {
  async loadUSDRates(currencies: string[]) {
    const symbols = currencies.join(',');
    const proms = fetch(`${URL}?app_id=${API_KEY}&base=${BASE}&symbols=${symbols}`);
    const json = await proms.then<RatesResp>((resp) => resp.json());
    return json.rates;
  }
}

export default new ExchangeRates();
