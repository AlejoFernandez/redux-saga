/* eslint-disable no-console */
import 'babel-polyfill';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import config from './webpack.config';
import express from 'express';
import path from 'path';
import favicon from 'serve-favicon';
import routes from './routes';
import React from 'react';
import Root from './containers/Root';
import { renderToString } from 'react-dom/server';
import { match, createMemoryHistory } from 'react-router';
import configureStore from './store/configureStore';
import rootSaga from './sagas';

const app = express();
const port = 3000;

app.use(favicon(path.join(__dirname, 'favicon.ico')));
const compiler = webpack(config);
app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }));
app.use(webpackHotMiddleware(compiler));

const layout = (body, initialState) => (`
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8"/>
    <title>Redux-saga real-world universal example</title>
  </head>
  <body>
    <div id="root"><div>${body}</div></div>
    <script type="text/javascript" charset="utf-8">
      window.__INITIAL_STATE__ = ${initialState};
    </script>
    <script src="/static/bundle.js"></script>
  </body>
  </html>
`);

app.use((req, res) => {
  console.log('req', req.url);
  const store = configureStore();

  // Note that req.url here should be the full URL path from
  // the original request, including the query string.
  match({ routes, location: req.url }, (error, redirectLocation, renderProps) => {
    if (error) {
      return res.status(500).send(error.message);
    }

    if (redirectLocation) {
      return res.redirect(302, redirectLocation.pathname + redirectLocation.search);
    }

    if (renderProps && renderProps.components) {
      const rootComp = (
        <Root
          store={store}
          routes={routes}
          history={createMemoryHistory()} renderProps={renderProps}
          type="server"
        />
      );

      store.runSaga(rootSaga).done
        .then(() => {
          console.log('sagas complete');
          res.status(200).send(
            layout(renderToString(rootComp), JSON.stringify(store.getState()))
          );
        })
        .catch((e) => {
          console.log(e.message);
          res.status(500).send(e.message);
        });

      return store.close();
    }

    return res.status(404).send('Not found');
  });
});


app.listen(port, (error) => {
  if (error) {
    return console.error(error);
  }

  return console.info('==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.', port, port);
});
