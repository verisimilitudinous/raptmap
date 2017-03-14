import React from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';
import TopicInput from './forms/TopicInput.jsx'
import LocationInput from './forms/LocationInput.jsx'
import UserInput from './forms/UserInput.jsx'
import store from './store.js'

// See ./TopicForm.jsx for an explanation of mapStateToProps,
// mapDispatchToProps, and the connect() function that appears
// at bottom.

const mapStateToProps = function(store) {
  return store
};

const mapDispatchToProps = function(dispatch, ownProps) {
  return {
    readyMap: function() {
      dispatch({
        type: 'READY_MAP',
        map_ready: true
      })
    },
  };
};

class SearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentDidMount() {
    this.props.readyMap();
  }
  handleSubmit(event) {
    if ((this.props.topic.value !== '') && (this.props.user.email !== '')) {
      const payload = {
        topic: {
          name: this.props.topic.name
        },
        location: {
          latitude: this.props.location.latitude,
          longitude: this.props.location.longitude,
          radius_length: this.props.radius.length,
          radius_units: "m"
        },
        user: {
          email: this.props.user.email
        }
      }
      let data = new FormData();
      data.append("json", JSON.stringify(payload));
      fetch("/subscriptions", {
        method: "POST",
        body: data
      }).then(function(response) {
        return response.json();
      }).then(function(data) {
        return json;
      });
    } else {
      // Form needs to be filled in.
    };
    event.preventDefault();
  }
  render() {
    return (
      <form className="search-form" onSubmit={this.handleSubmit}>
        <TopicInput/>
        <LocationInput/>
        <div id="map"></div>
        <UserInput/>
        <div className="content-blok submit-input">
          <button type="submit">{gon.submit_label}</button>
        </div>
      </form>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchForm);
