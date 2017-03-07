import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import FormWidget from './FormWidget.jsx'
import store from './store.js'

// Initialize the React app, FormWidget.
// https://facebook.github.io/react/docs/react-dom.html

// Note the Provider component. This is coming out of react-redux and wires
// the app to the Redux store's state.
// https://github.com/reactjs/react-redux/blob/master/docs/api.md#provider-store

function readyApp() {
  render(
    <Provider store={store}>
      <FormWidget/>
    </Provider>,
    document.querySelector('.map-subscription-form')
  );
}

export default readyApp;
