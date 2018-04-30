import * as React from 'react';
import { PureComponent } from 'react';
import { inject, observer } from 'mobx-react';
import trimStart from 'lodash/trimStart';
import upperCase from 'lodash/upperCase';

import { PurseSwiper } from 'app/components/Purse';
import OpList from 'app/components/OpList';
import { ExchangeBtn } from 'app/components/Buttons';
import { PURSE, ROUTER } from 'app/constants';
import { PurseStore, RouterStore } from 'app/stores';

import Screen from '../Screen';
import * as style from './style.scss';

interface PurseProps {
  [PURSE]: PurseStore;
  [ROUTER]: RouterStore;
}

const DEFAULT_FROM = 'USD';

@inject(ROUTER, PURSE)
@observer
export default class Purse extends PureComponent<PurseProps, { loading: boolean }> {
  convertFrom: string;

  constructor(props) {
    super(props);
    this.state = { loading: false };
    this.onExchange = this.onExchange.bind(this);
    this.onSlideChange = this.onSlideChange.bind(this);
  }

  onSlideChange(currency: string) {
    this.convertFrom = currency;
  }

  async onExchange() {
    const purseStore = this.props[PURSE] as PurseStore;
    this.setState({ loading: true });
    try {
      await purseStore.startExchange();
      const router = this.props[ROUTER] as RouterStore;
      router.push(`exchange#${this.convertFrom}`);
    } catch {
      this.setState({ loading: true });
    }
  }

  componentWillMount() {
    const router = this.props[ROUTER] as RouterStore;
    const purseStore = this.props[PURSE] as PurseStore;
    let convertFrom = upperCase(trimStart(router.location.hash, '#'));
    convertFrom = purseStore.purse.has(convertFrom) ? convertFrom : DEFAULT_FROM;
    this.convertFrom = convertFrom;
  }

  render() {
    const purseStore = this.props[PURSE] as PurseStore;
    const exchanges = purseStore.exchanges;
    const { loading } = this.state;
    return (
      <Screen className={style.screen}>
        <div className={style.swiperWrapper}>
          <PurseSwiper
            purse={purseStore.purse}
            currency={this.convertFrom}
            onSlideChange={this.onSlideChange}
          />
        </div>
        <div className={style.buttonsWrapper}>
          <ExchangeBtn loading={loading} onClick={this.onExchange} />
        </div>
        <div className={style.listWrapper}>
          <OpList items={exchanges.toArray()} />
        </div>
      </Screen>
    );
  }
}
