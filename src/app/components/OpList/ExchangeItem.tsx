import * as React from 'react';
import { PureComponent } from 'react';
import * as classNames from 'classnames';
import * as format from 'date-fns/format';

import { CURRENCIES } from 'app/constants';
import Amount from '../Amount';
import * as style from './item.scss';

export interface Exchange {
  fromVal: number;
  toVal: number;
  to: string;
  from: string;
  timestamp: number;
}

interface ExchangeItemOps {
  className?: string;
  item: Exchange;
}

export default class ExchangeItem extends PureComponent<ExchangeItemOps> {
  render() {
    const {
      className,
      item,
    } = this.props;
    const fromSymb = CURRENCIES[item.to].symb;
    const toSymb = CURRENCIES[item.from].symb;
    return (
      <div className={classNames(style.listItem, className)}>
        <div className={style.exInfo}>
          <div>Exchanged from {item.from.toUpperCase()}</div>
          <div className={classNames(style.secondText, style.dateText)}>
            {format(item.timestamp, 'DD.MM.YYYY')}
          </div>
        </div>
        <div className={style.exAmount}>
          <div>
            <Amount
              value={item.toVal}
              currency={fromSymb}
              showPlus
            />
          </div>
          <div className={classNames(style.secondText, style.fromVal)}>
            <Amount
              value={-item.fromVal}
              currency={toSymb}
            />
          </div>
        </div>
      </div>
    );
  }
}
