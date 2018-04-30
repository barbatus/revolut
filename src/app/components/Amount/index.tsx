import * as React from 'react';
import { PureComponent } from 'react';
import * as classNames from 'classnames';

import * as style from './style.scss';

interface AmountProps {
  className?: string;
  value: number;
  currency: string;
  showPlus?: boolean;
  minFrac?: boolean;
  showFrac4?: boolean;
}

export default class Amount extends PureComponent<AmountProps> {
  renderFrac(frac: number, minFrac = false) {
    return (
      <span className={classNames({[style.fractional]: minFrac})}>
        {frac < 10 ? `0${frac}` : frac}
      </span>
    );
  }

  render() {
    const {
      className,
      value,
      currency,
      showPlus,
      minFrac,
      showFrac4,
    } = this.props;
    const sign = value > 0 ? (showPlus ? '+' : '') : (value ? '-' : '');
    const absNum = Math.abs(value);
    const round2Val = Math.round(absNum * 100) / 100;
    const int = Math.floor(round2Val);
    const round4Val = Math.round(absNum * 10000) / 10000;
    const frac2 =  Math.floor((round2Val % 1) * 100);
    const frac4 =  Math.floor(((round4Val * 100) % 1) * 100);
    const renderFrac4 = frac4 && showFrac4;
    return (
      <div className={classNames(className, style.container)}>
        {sign ? <span className={style.sign}>{sign}</span> : null}
        <span className={style.currency}>{currency}</span>
        <span>{int}</span>
        { frac2 || renderFrac4 ? '.' : null }
        { frac2 || renderFrac4 ? this.renderFrac(frac2, minFrac) : null }
        { renderFrac4 ? this.renderFrac(frac4, true) : null }
      </div>
    );
  }
}
