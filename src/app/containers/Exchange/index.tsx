import * as React from 'react';
import { PureComponent } from 'react';
import { inject, observer } from 'mobx-react';
import trimStart from 'lodash/trimStart';
import upperCase from 'lodash/upperCase';

import { ExchangeFrom, ExchangeTo, Header } from 'app/components/Exchange';
import { PURSE, ROUTER, CURRENCIES } from 'app/constants';
import { PurseStore, RouterStore } from 'app/stores';
import { Amount } from 'app/components';

import { isNumber } from 'app/utils';
import Screen from '../Screen';
import * as style from './style.scss';

const DEFAULT_FROM = 'USD';

interface ExchangeState {
  value: number;
  allowExchange: boolean;
  convertFrom?: string;
  convertTo?: string;
}

@inject(ROUTER, PURSE)
@observer
export default class Exchange extends PureComponent<{}, ExchangeState> {
  constructor(props) {
    super(props);
    this.state = {
      value: null,
      allowExchange: false,
    };
    this.onFromValueChange = this.onFromValueChange.bind(this);
    this.onFromCurrChange = this.onFromCurrChange.bind(this);
    this.onToCurrChange = this.onToCurrChange.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onExchange = this.onExchange.bind(this);
  }

  componentWillMount() {
    const router = this.props[ROUTER] as RouterStore;
    const purseStore = this.props[PURSE] as PurseStore;
    const convertFrom = upperCase(trimStart(router.location.hash, '#') || DEFAULT_FROM);
    const currencies = Object.keys(CURRENCIES);
    const convertTo = currencies.find((curr) => curr !== convertFrom);
    this.setState({ convertFrom, convertTo });
    if (!purseStore.hasRates) {
      purseStore.startExchange();
    }
  }

  onFromValueChange(value: number) {
    const { convertFrom, convertTo } = this.state;
    const purseStore = this.props[PURSE] as PurseStore;
    const purse = purseStore.purse;
    const total = purse.get(convertFrom);
    const allowExchange = value && total >= Number(value) && convertFrom !== convertTo;
    this.setState({
      value,
      allowExchange,
    });
  }

  onToCurrChange(curr: string) {
    this.setState({ convertTo: curr });
  }

  onFromCurrChange(curr: string) {
    this.setState({ convertFrom: curr });
  }

  onExchange() {
    const purseStore = this.props[PURSE] as PurseStore;
    const { value, convertFrom, convertTo } = this.state;
    purseStore.exchange(convertFrom, convertTo, Number(value));
    this.onCancel();
  }

  onCancel() {
    const purseStore = this.props[PURSE] as PurseStore;
    purseStore.stopExchange();
    const { convertFrom } = this.state;
    const router = this.props[ROUTER] as RouterStore;
    router.push(`/#${convertFrom}`);
  }

  render() {
    const { value, convertFrom, convertTo, allowExchange } = this.state;
    const purseStore = this.props[PURSE] as PurseStore;
    const purse = purseStore.purse;
    const rates = purseStore.rates;
    if (!purseStore.hasRates) { return null; }

    const rate = rates.get(convertFrom).get(convertTo);
    return (
      <Screen className={style.screen}>
        <Header
          fromSymb={CURRENCIES[convertFrom].symb}
          toSymb={CURRENCIES[convertTo].symb}
          rate={rate}
          onCancel={this.onCancel}
          onExchange={this.onExchange}
          allowExchange={allowExchange}
        />
        <div className={style.swiperWrapper}>
          <ExchangeFrom
            purse={purse}
            value={value}
            currency={convertFrom}
            onChange={this.onFromValueChange}
            onSlideChange={this.onFromCurrChange}
          />
        </div>
        <div className={style.swiperWrapperFrom}>
          <ExchangeTo
            purse={purse}
            convertFrom={convertFrom}
            currency={convertTo}
            rates={rates}
            value={value}
            onSlideChange={this.onToCurrChange}
          />
        </div>
      </Screen>
    );
  }
}
