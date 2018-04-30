import * as React from 'react';
import { PureComponent, MouseEvent } from 'react';

import Amount from '../Amount';
import * as style from './header.scss';

interface HeaderProps {
  fromSymb: string;
  toSymb: string;
  rate: number;
  allowExchange: boolean;
  onCancel: (event: MouseEvent<HTMLButtonElement>) => void;
  onExchange: (event: MouseEvent<HTMLButtonElement>) => void;
}

export default class Header extends PureComponent<HeaderProps> {
  render() {
    const {
      fromSymb,
      toSymb,
      rate,
      allowExchange,
      onCancel,
      onExchange,
    } = this.props;
    return (
      <div className={style.container}>
        <button onClick={onCancel}>Cancel</button>
        <div className={style.rate}>
          <Amount currency={fromSymb} value={1} />&nbsp;=&nbsp;
          <Amount currency={toSymb} value={rate} showFrac4 />
        </div>
        <button
          disabled={!allowExchange}
          onClick={onExchange}
        >
          Exchange
        </button>
      </div>
    );
  }
}
