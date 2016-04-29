import 'babel-polyfill';
import React from 'react';
import { history } from './services';
import configureStore from './store/configureStore';
import { renderWithHotReload, hotReloadSagas } from './hot-reload';

const store = configureStore(window.__INITIAL_STATE__);
hotReloadSagas(store);

renderWithHotReload({
  configure: (Root) => <Root store={store} history={history} />,
  elementId: 'root'
});
