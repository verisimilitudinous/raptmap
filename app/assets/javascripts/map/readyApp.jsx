import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import TopicForm from './forms/TopicForm.jsx'
import LocationForm from './forms/LocationForm.jsx'
import ConfirmationForm from './forms/ConfirmationForm.jsx'
import store from './store.js'

// Initialize the React components.
// https://facebook.github.io/react/docs/react-dom.html

// Note the Provider component. This is coming out of react-redux and wires
// the components to the Redux store's state.
// https://github.com/reactjs/react-redux/blob/master/docs/api.md#provider-store

function readyTopicForm() {
  render(
    <Provider store={store}>
      <TopicForm/>
    </Provider>,
    document.getElementById('topic-form')
  );
}

function readyLocationForm() {
  render(
    <Provider store={store}>
      <LocationForm/>
    </Provider>,
    document.getElementById('location-form')
  );
}

function readyConfirmationForm() {
  render(
    <Provider store={store}>
      <ConfirmationForm/>
    </Provider>,
    document.getElementById('confirmation-form')
  );
}

function readyApp() {
  readyTopicForm();
  readyLocationForm();
  readyConfirmationForm();
}

export default readyApp;
