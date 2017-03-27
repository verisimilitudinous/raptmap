import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import Switchboard from './Switchboard.jsx'
import store from '../store.js'
import readyMap from '../leaflet/snapMap.js'

// Initialize the React components.
// https://facebook.github.io/react/docs/react-dom.html

// Note the Provider component. This is coming out of react-redux and wires
// the components to the Redux store's state.
// https://github.com/reactjs/react-redux/blob/master/docs/api.md#provider-store

function readyApp() {
  render(
    <Provider store={store}>
      <Switchboard/>
    </Provider>,
    document.getElementById('search-form')
  );
  // Initialize the map after the React app creates the placeholder for it.
  readyMap();
}

export default readyApp;
