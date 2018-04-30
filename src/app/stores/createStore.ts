import { History } from 'history';
import { Map } from 'immutable';

import { RouterStore } from './RouterStore';
import { PurseStore } from './PurseStore';
import { PURSE, ROUTER } from 'app/constants';

export function createStores(history: History) {
  const purseStore = new PurseStore(
    Map({ USD: 99, EUR: 30, IDR: 100000 }),
    [{ from: 'USD', to: 'EUR', fromVal: 5, toVal: 4.13, timestamp: Date.now() }],
  );
  const routerStore = new RouterStore(history);
  return {
    [PURSE]: purseStore,
    [ROUTER]: routerStore
  };
}
