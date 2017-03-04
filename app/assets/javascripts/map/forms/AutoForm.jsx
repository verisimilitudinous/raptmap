import React from 'react';
import {render} from 'react-dom';
import Autosuggest from 'react-autosuggest';

const autoDispatchersByModel = function(dispatch, model) {
  const dispatches = { type: 'CHANGE_' + model.toUpperCase() };
  return {
    changeValue: function(value) {
      dispatches[model] = {
        live: {
          value: value,
          selected: null,
          warn: false
        }
      }
      dispatch(dispatches);
    },
    selectSuggestion: function(suggestion) {
      dispatches[model] = {
        live: {
          selected: suggestion
        }
      }
      dispatch(dispatches);
    },
    populateSuggestions: function(suggestions) {
      dispatches[model] = {
        live: {
          suggestions: suggestions
        }
      }
      dispatch(dispatches);
    },
    clearSuggestions: function() {
      dispatches[model] = {
        live: {
          suggestions: []
        }
      }
      dispatch(dispatches);
    },
    toggleWarning: function(boolean) {
      dispatches[model] = {
        live: {
          warn: boolean
        }
      }
      dispatch(dispatches);
    }
  }
}

function getRemoteList(url, callback) {
  fetch(url).then(function(response) {
    return response.json();
  }).then(function(json) {
    return json;
  }).then(function(data) {
    return callback(data);
  });
};

// https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Using_Special_Characters
function escapeRegexCharacters(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getSuggestionValue(suggestion) {
  return suggestion.name;
}

function renderSuggestion(suggestion) {
  return (
    <span>{suggestion.name}</span>
  );
}

function renderInputComponent(inputProps) {
  return  (
    <input autoFocus {...inputProps} />
  );
}

class AutoForm extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onSuggestionSelected = this.onSuggestionSelected.bind(this);
    this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
    this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
  }

  handleChange(event, { newValue, method }) {
    if (this.props.value !== newValue) {
      this.props.changeValue(newValue);
    }
  }

  handleSubmit(event) {
    if (this.props.value !== '') {
      this.props.commitValues(this.props.value, this.props.selected);
    };
    event.preventDefault();
  }

  onSuggestionSelected(event, { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }) {
    this.props.selectSuggestion(suggestion);
  }

  onSuggestionsFetchRequested({ value }) {
    if (this.props.value !== value) {
      const escapedValue = escapeRegexCharacters(value.trim());
      const regex = new RegExp('^' + escapedValue, 'i');
      getRemoteList((this.props.url + escapedValue), (data) => {
        const suggestions = data.filter(topic => regex.test(topic.name));
        if (this.props.suggestions !== suggestions) {
          this.props.populateSuggestions(suggestions);
        }
      });
    }
  }

  onSuggestionsClearRequested() {
    this.props.clearSuggestions();
  }

  render() {
    const inputProps = {
      placeholder: (this.props.warn ? this.props.warning : this.props.placeholder),
      value: this.props.value,
      onChange: this.handleChange
    };

    return (
      <form className="auto-form" onSubmit={this.handleSubmit}>
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
        <button className="pure-button pure-button-primary" type="submit">Submit</button>
      </form>
    );
  }
}

export { AutoForm, autoDispatchersByModel };
