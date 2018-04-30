import * as React from 'react';
import { PureComponent } from 'react';

import Amount from '../Amount';
import * as style from './slide.scss';

interface SlideProps {
  currency: string;
  symb: string;
  total: number;
  name: string;
}

export class Slide extends PureComponent<SlideProps> {
  render() {
    const {
      currency,
      symb,
      total,
      name,
    } = this.props;
    return (
      <div>
        <div className={style.valueRow}>
          <Amount minFrac value={total} currency={symb} />
        </div>
        <div className={style.currencyRow}>
          <span>{currency.toUpperCase()} - {name}</span>
        </div>
      </div>
    );
  }
}
