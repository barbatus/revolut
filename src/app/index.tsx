import * as React from 'react';
import { hot } from 'react-hot-loader';
import { Router, Route, Switch } from 'react-router';

import Purse from 'app/containers/Purse';
import Exchange from 'app/containers/Exchange';

// render react DOM
export const App = hot(module)(({ history }) => (
  <div>
    <Router history={history}>
      <Switch>
        <Route path='/exchange' component={Exchange} />
        <Route path='/' component={Purse} />
      </Switch>
    </Router>
  </div>
));
