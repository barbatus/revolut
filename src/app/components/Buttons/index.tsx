import * as React from 'react';
import { MouseEvent } from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import * as faSyncAlt from '@fortawesome/fontawesome-free-solid/faSyncAlt';

import * as style from './style.scss';

const IconButton = ({ loading, icon, onClick }:
    { loading: boolean, icon: any, onClick: (event: MouseEvent<HTMLAnchorElement>) => void }) => (
  <a className={style.iconWrapper} onClick={onClick}>
    <FontAwesomeIcon spin={loading} icon={icon} />
  </a>
);

export const ExchangeBtn = (props) => (
  <div>
    <IconButton {...props} icon={faSyncAlt} />
    <div className={style.btnText}>Exchange</div>
  </div>
);
