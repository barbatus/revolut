import * as React from 'react';
import { PureComponent, ChangeEvent } from 'react';

import Amount from '../Amount';
import * as style from './slide.scss';

interface SlideProps {
  currency: string;
  symb: string;
  symb2: string;
  rate: number;
  total: number;
  value?: number | string;
  active: boolean;
  editable?: boolean;
  withInput?: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export class Slide extends PureComponent<SlideProps> {
  static defaultProps = {
    value: null,
  };

  inputRef = null;

  componentDidMount() {
    if (this.props.active) {
      this.inputRef.focus();
    }
  }

  componentDidUpdate() {
    if (this.props.active) {
      this.inputRef.focus();
    }
  }

  renderRate(symb: string, symb2: string, rate: number) {
    return (
      <div>
        <Amount value={1} currency={symb} />&nbsp;=&nbsp;
        <Amount value={rate} currency={symb2} showFrac4 />
      </div>
    );
  }

  render() {
    const {
      currency,
      symb,
      symb2,
      rate,
      total,
      value,
      editable,
      onChange,
      withInput,
    } = this.props;
    return (
      <div className={style.container}>
        <div className={style.inputRow}>
          <span>{currency}</span>
          <input
            tabIndex={0}
            type={withInput ? 'number' : 'text'}
            ref={(ref) => (this.inputRef = ref)}
            value={value === null ? '' : value}
            disabled={!editable}
            onChange={onChange}
          />
        </div>
        <div className={style.infoRow}>
          <div>You have <Amount value={total} currency={symb} /></div>
          {rate ? this.renderRate(symb, symb2, rate) : null}
        </div>
      </div>
    );
  }
}
