import React from 'react';
import {render} from 'react-dom';
import Autosuggest from 'react-autosuggest';

// Two of the components in this app, TopicForm and LocationForm,
// are form fields that provide auto-complete functionality as the
// user types. This component, AutoForm, is an intermediate component
// for use in each, providing the common functionality required to make
// auto-complete work.

// autoDispatchersByModel() helps generate appropriate dispatch functions
// for use by react-redux. See ./TopicForm.jsx or ./LocationForm.jsx to
// see it in context. That's the only way it's going to make sense.
const autoDispatchersByModel = function(dispatch, model) {

  // First, we create the base Redux action, 'dispatches'. It's just an
  // object. The only thing we're worried about here is adding the 'type'
  // attribute with a value that reflects the submitted 'model'.
  const dispatches = { type: 'CHANGE_' + model.toUpperCase() };

  return {
    // changeValue() is our first dispatch function. It will get triggered
    // whenever the user types a new value into the form field.
    changeValue: function(value) {
      // We're going to take the dispatches object above and add a new
      // object within, keyed to the supplied model.
      dispatches[model] = {
        // Supply the form field's current value.
        value: value,
        // The user has input a new value, so any selections should be
        // voided.
        selected: null,
        // Erase any warnings pending the next submission.
        warn: false
      }
      // Take the revised 'dispatches' object and, well, dispatch it.
      dispatch(dispatches);
    },
    // selectSuggestion() will be triggered whenever the user selects a
    // value from the auto-completer's suggestions.
    selectSuggestion: function(suggestion) {
      dispatches[model] = {
        selected: suggestion
      }
      dispatch(dispatches);
    },
    // populateSuggestions() will be triggered whenever an auto-complete
    // response comes back from the server with a list of suggestions.
    populateSuggestions: function(suggestions) {
      dispatches[model] = {
        suggestions: suggestions
      }
      dispatch(dispatches);
    },
    // clearSuggestions() will cleaar out the auto-complete suggestions
    // as needed.
    clearSuggestions: function() {
      dispatches[model] = {
        suggestions: []
      }
      dispatch(dispatches);
    },
    // toggleWarning() is used to help highlight fields that have failed
    // a validation, to help the user make corrections.
    toggleWarning: function(boolean) {
      dispatches[model] = {
        warn: boolean
      }
      dispatch(dispatches);
    }
  }
}

// getRemoteList() fetches the auto-complete suggestions from the server.
function getRemoteList(url, callback) {
  fetch(url).then(function(response) {
    return response.json();
  }).then(function(json) {
    return json;
  }).then(function(data) {
    return callback(data);
  });
};

// Helps react-autosuggest sort suggestions.
function escapeRegexCharacters(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Tells react-autosuggest how to fetch the name from a suggestion.
function getSuggestionValue(suggestion) {
  return suggestion.name;
}

// Tells react-autosuggest how to render a suggestion.
function renderSuggestion(suggestion) {
  return (
    <span>{suggestion.name}</span>
  );
}

// Tells react-autosuggest how to render the form field.
function renderInputComponent(inputProps) {
  return  (
    <input autoFocus {...inputProps} />
  );
}

// Finally, AutoForm is our React component for auto-completers.
// It gets its mojo from the aforementioned react-autosuggest.
// http://react-autosuggest.js.org/
class AutoForm extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onSuggestionSelected = this.onSuggestionSelected.bind(this);
    this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
    this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
  }

  // Change state in the store whenever the user enters a new value.
  // See handleChange() in autoDispatchersByModel() above.
  handleChange(event, { newValue, method }) {
    if (this.props.value !== newValue) {
      this.props.changeValue(newValue);
    }
  }

  // Submits the form.
  // Unlike many of the other dispatch functions defined within
  // autoDispatchersByModel() above, commitValues() is specific to
  // each model and must be defined locally. See ./TopicForm.jsx or
  // ./LocationForm.jsx for examples.
  handleSubmit() {
    if (this.props.value !== '') {
      this.props.commitValues(this.props.value);
    };
  }

  // Changes the selected suggestion.
  // See selectSuggestion() in autoDispatchersByModel() above.
  onSuggestionSelected(event, { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }) {
    this.props.selectSuggestion(suggestion);
  }

  // Sorts the suggestions for relevance as they arrive from the server.
  onSuggestionsFetchRequested({ value }) {
    if (this.props.value !== value) {
      // Escape the weird characters...
      const escapedValue = escapeRegexCharacters(value.trim());
      // ...then create the regex.
      const regex = new RegExp('^' + escapedValue, 'i');
      getRemoteList((this.props.url + "?query=" + escapedValue), (data) => {
        // Filter the suggestions based upon the regex defined above.
        // We only want to include suggestions that match 'regex' for
        // the purposes of auto-complete.
        const suggestions = data.contents.filter(topic => regex.test(topic.name));
        if (this.props.suggestions !== suggestions) {
          // Populates the auto-completer's suggestions.
          // See populateSuggestions() in autoDispatchersByModel() above.
          this.props.populateSuggestions(suggestions);
        }
      });
    }
  }

  // Clears the suggestions.
  // See clearSuggestion() in autoDispatchersByModel() above.
  onSuggestionsClearRequested() {
    this.props.clearSuggestions();
  }

  render() {
    // inputProps is standard practice for react-autosuggest.
    // https://github.com/moroshko/react-autosuggest#inputPropsProp
    const inputProps = {
      placeholder: (this.props.warn ? this.props.warning : this.props.placeholder),
      value: this.props.value,
      onChange: this.handleChange,
      name: this.props.inputName
    };

    // Here comes the excitement. Pass all the stuff above into
    // react-autosuggest. More info on all the props here:
    // https://github.com/moroshko/react-autosuggest#props
    return (
      <div className={this.props.warn ? 'auto-field warn' : 'auto-field'}>
        <Autosuggest
          suggestions={this.props.suggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={renderSuggestion}
          renderInputComponent={renderInputComponent}
          onSuggestionSelected={this.onSuggestionSelected}
          inputProps={inputProps} />
      </div>
    );
  }
}

export { AutoForm, autoDispatchersByModel };
