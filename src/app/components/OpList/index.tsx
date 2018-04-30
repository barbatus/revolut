import * as React from 'react';
import { PureComponent } from 'react';
import { Stack } from 'immutable';

import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import * as faSyncAlt from '@fortawesome/fontawesome-free-solid/faSyncAlt';

import * as style from './style.scss';
import ExchangeItem, { Exchange } from './ExchangeItem';

interface OpListProps {
  className?: string;
  items: Exchange[];
}

export default class OpList extends PureComponent<OpListProps, any> {
  render() {
    const {
      className,
      items,
    } = this.props;
    const children = items.map((item, index) => {
      return (
        <div key={index} className={style.itemWrapper}>
          <div className={style.itemIcon}>
            <FontAwesomeIcon icon={faSyncAlt} />
          </div>
          <ExchangeItem item={item} />
        </div>
      );
    });
    return (
      <div className={className}>
        {children}
      </div>
    );
  }
}
