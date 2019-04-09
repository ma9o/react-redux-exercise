import * as React from 'react';
import * as ReactDOM from 'react-dom';
import localForage from 'localforage';
import logger from 'redux-logger';
import MainContainer from './containers/MainContainer';
import rootReducer from './redux/reducers';
import { applyMiddleware, createStore } from 'redux';
import { CircularProgress } from '@material-ui/core';
import { composeWithDevTools } from 'redux-devtools-extension';
import { PersistGate } from 'redux-persist/integration/react';
import { persistReducer, persistStore } from 'redux-persist';
import { Provider } from 'react-redux';

const persistConfig = {
  key: 'root',
  storage: localForage
};

const pReducer = persistReducer(persistConfig, rootReducer);
const store = createStore(
  pReducer,
  composeWithDevTools(applyMiddleware(logger))
);
const persistor = persistStore(store);

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={<CircularProgress />} persistor={persistor}>
      <MainContainer />
    </PersistGate>
  </Provider>,
  document.querySelector('#root')
);
