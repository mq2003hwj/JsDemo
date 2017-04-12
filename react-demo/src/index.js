import './index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory } from 'react-router';

import Demo1 from './demo1/Demo1';
import FundCommission from './demo1/FundCommission';

ReactDOM.render(
  <Router history={hashHistory}>
      <Route path="/index" component={ FundCommission } />
      <Route path="/demo1" component={ Demo1 } />
  </Router>,
  document.getElementById('root')
); 