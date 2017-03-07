import { createStore, combineReducers } from 'redux';
import Immutable from 'seamless-immutable'

// This is the main Redux store for this app.

// First, we need to define our store's reducers.
// More on reducers here:
// http://redux.js.org/docs/basics/Reducers.html
const reducer = function(state, action) {

  // When the app first loads, the store will not have any state yet.
  // Here we can define defaults.
  // I like to define the whole "schema" here for future reference.
  if (state === undefined) {
    // Managing Redux stores is way easier when you force yourself to
    // use FP-style immutable data structures. Here we're using:
    // https://github.com/rtfeldman/seamless-immutable
    state = Immutable({
      topic: {
        name: "",
        revealed: true,
        live: {
          value: "",
          selected: null,
          suggestions: [],
          warn: false
        }
      },
      location: {
        name: "",
        latitude: null,
        longitude: null,
        revealed: false,
        live: {
          value: "",
          selected: null,
          suggestions: [],
          warn: false
        }
      },
      radius: {
        length: 3,
        units: "km",
        in_meters: 3000,
        revealed: false,
        warn: false
      },
      step: 1
    });
  };

  // Respond to the "action" dispatched to the store based upon the action's type.
  // See the store.dispatch() code in ./snapMap.js for a straight-forward example
  // of what gets submitted in an action.
  // There's a great summary of Redux actions here:
  // http://redux.js.org/docs/basics/Actions.html
  // I don't like the way this is currently configured. IMO the action types should
  // be way more specific, based upon intent, rather than clobbering bigger chunks of
  // the state on every update. This is quick and dirty for now though.
  switch (action.type) {
  // Accepts a full update to the whole store. Yikes.
  case 'CHANGE_ALL':
    // The merge method returns the entire state, only applying the action's changes.
    return Immutable.merge(state, Immutable.without(action, "type"), { deep: true });
  // Accepts a full update to the topic sub-state.
  case 'CHANGE_TOPIC':
    return Immutable.merge(state, {
      topic: action.topic,
      // Check to see if a step change was also submitted.
      step: (action.step ? action.step : state.step)
    }, { deep: true });
  case 'CHANGE_LOCATION':
    return Immutable.merge(state, {
      location: action.location,
      step: (action.step ? action.step : state.step)
    }, { deep: true });
  case 'CHANGE_RADIUS':
    return Immutable.merge(state, {
      radius: action.radius,
      step: (action.step ? action.step : state.step)
    }, { deep: true });
  case 'CHANGE_STEP':
    return Immutable.merge(state, {
      step: (action.step ? action.step : state.step)
    });
  }
  return state;
};

// Creates the store with the given reducer.
// http://redux.js.org/docs/api/createStore.html
const store = createStore(reducer);

module.exports = store;
