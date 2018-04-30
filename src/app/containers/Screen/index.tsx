import * as React from 'react';
import * as classNames from 'classnames';

import * as style from './style.scss';

export default class Root extends React.PureComponent<any, any> {
  renderDevTool() {
    if (process.env.NODE_ENV !== 'production') {
      const DevTools = require('mobx-react-devtools').default;
      return <DevTools />;
    }
  }

  render() {
    const { className } = this.props;
    return (
      <div className={classNames(style.container, className)}>
        {this.props.children}
        {this.renderDevTool()}
      </div>
    );
  }
}
