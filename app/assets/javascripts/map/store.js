import { createStore, combineReducers } from 'redux';
import Immutable from 'seamless-immutable'

const reducer = function(state, action) {
  if (state === undefined) {
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
  switch (action.type) {
  case 'CHANGE_ALL':
    return Immutable.merge(state, Immutable.without(action, "type"), { deep: true });
  case 'CHANGE_TOPIC':
    return Immutable.merge(state, {
      topic: action.topic,
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

const store = createStore(reducer);

store.subscribe(() => {
  //console.log(store.getState());
});

module.exports = store;
