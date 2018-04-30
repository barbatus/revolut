import { observable, computed, action, flow, configure } from 'mobx';
import { Map, Stack } from 'immutable';

import { exchangeSrv, Rates } from 'app/services';
import { CURRENCIES } from 'app/constants';

configure({ enforceActions: true });

export interface Exchange {
  from: string;
  to: string;
  fromVal: number;
  toVal: number;
  timestamp: number;
}

export class PurseStore {
  @observable public purse: Map<string, number>;
  @observable public rates: Map<string, Map<string, number>>;
  @observable public exchanges = Stack<Exchange>();

  @observable private interval = null;

  @computed
  get hasRates() {
    return !!this.interval;
  }

  startExchange = flow(function* () {
    yield this.loadRates();
    clearInterval(this.interval);
    this.interval = setInterval(() => this.loadRates(), 10000);
  });

  loadRates = flow(function* () {
    try {
      const currencies = Object.keys(CURRENCIES);
      const usdRates = yield exchangeSrv.loadUSDRates(currencies);
      this.rates = this.updateRates(usdRates, this.rates, currencies);
    } catch (ex) {
      console.log(ex);
    }
  });

  constructor(purse, exchanges: Exchange[]) {
    this.purse = purse;
    const currencies = Object.keys(CURRENCIES);
    const rates = Map<string, Map<string, number>>();
    this.rates = rates.withMutations((map) => {
      for (let i = 0; i < currencies.length; i++) {
        map.set(currencies[i], Map());
      }
    });
    this.exchanges = this.exchanges.pushAll(exchanges);
  }

  @action
  exchange(from: string, to: string, value: number): void {
    const rate = this.rates.get(from).get(to);
    this.purse = this.purse.withMutations((map) => {
      map.update(from, (fromValue) => fromValue - value);
      if (map.has(to)) {
        map.update(to, (toValue) => toValue + rate * value);
      } else {
        map.set(to, rate * value);
      }
    });
    this.exchanges = this.exchanges.push({
      from, to, fromVal: value, toVal: rate  * value,
      timestamp: Date.now(),
    });
  }

  @action
  stopExchange() {
    clearInterval(this.interval);
    this.interval = null;
  }

  updateRates(
    usdResult: Rates,
    prevRates: Map<string, Map<string, number>>,
    currencies: string[],
  ) {
    // nextRates will change only if any rate of usdResult is diferent.
    let nextRates = prevRates;
    for (let i = 0; i < currencies.length; i++) {
      const from = currencies[i];
      let convMap = nextRates.get(from);
      for (let j = 0; j < currencies.length; j++) {
        const to = currencies[j];
        const rate = from !== to ?
          (1 / usdResult[from]) * usdResult[to] : 1;
        if (!convMap.has(to) || convMap.get(to) !== rate) {
          convMap = convMap.set(to, rate);
        }
      }
      if (nextRates.get(from) !== convMap) {
        nextRates = nextRates.set(from, convMap);
      }
    }
    return nextRates;
  }
}

export default PurseStore;
