import { END } from 'redux-saga';

function hotReloadSagas(store) {
  module.hot && module.hot.accept('../sagas', loadSagas);
  loadSagas();

  function loadSagas() {
    const rootSagas = require('../sagas').default;
    store.dispatch(END);
    store.runSaga(rootSagas);
  }
}

export default hotReloadSagas;
