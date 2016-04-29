import React from 'react';
import { render } from 'react-dom';
import RedBox from 'redbox-react';

function renderWithHotReload({ elementId, configure }) {
  const rootElement = document.getElementById(elementId);
  renderRoot();
  setupHotModuleReload();

  function renderRoot() {
    const Root = require('../containers/Root').default;
    render(configure(Root), rootElement);
  }

  function setupHotModuleReload() {
    module.hot && module.hot.accept('../containers/Root', () => setTimeout(hotReload));
  }

  function hotReload() {
    try {
      renderRoot();
    } catch (error) {
      renderError(error);
    }
  }

  function renderError(error) {
    render(<RedBox error={error} />, rootElement);
  }
}

export default renderWithHotReload;
