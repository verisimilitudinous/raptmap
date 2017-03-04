import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import FormWidget from './FormWidget.jsx'
import store from './store.js'

function readyApp() {
  render(
    <Provider store={store}>
      <FormWidget/>
    </Provider>,
    document.querySelector('.map-subscription-form')
  );
}

export default readyApp;
