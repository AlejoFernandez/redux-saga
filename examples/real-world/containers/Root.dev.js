import React, { Component, PropTypes } from 'react';
import { Provider } from 'react-redux';
import { Router, RouterContext } from 'react-router';
import DevTools from './DevTools';
import defaultRoutes from '../routes';

export default class Root extends Component {
  render() {
    const { store, history, routes, type, renderProps } = this.props;

    return (
      <Provider store={store}>
        <div>
          {
            type === 'server'
              ? <RouterContext {...renderProps} />
              : <Router history={history} routes={routes || defaultRoutes} />
          }
          <DevTools />
        </div>
      </Provider>
    );
  }
}

Root.propTypes = {
  store: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  routes: PropTypes.node
};
