import React from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';
import TopicInput from './TopicInput.jsx'
import LocationInput from './LocationInput.jsx'
import UserInput from './UserInput.jsx'

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
    warnUser: function(warning) {
      dispatch({
        type: 'WARN_USER',
        warning: warning
      })
    },
    warnTopic: function(warning) {
      dispatch({
        type: 'WARN_TOPIC',
        warning: warning
      })
    },
    declareSuccess: function() {
      dispatch({
        type: 'SUCCESSFULLY_CREATED'
      })
    }
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
      const csrfToken = document.querySelector('meta[name=csrf-token]').content;
      const payload = {
        subscription: {
          topic_attributes: {
            name: this.props.topic.value
          },
          location_attributes: {
            latitude: this.props.location.latitude,
            longitude: this.props.location.longitude,
            radius_length: this.props.radius.length,
            radius_units: "m"
          },
          user_attributes: {
            email: this.props.user.email
          }
        },
        authenticity_token: csrfToken,
        utf8: "✓"
      };
      const declareSuccess = this.props.declareSuccess;
      fetch("/rich_subscriptions", {
        method: "POST",
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRF-Token': csrfToken
        },
        body: JSON.stringify(payload),
        credentials: 'same-origin'
      }).then(function(response) {
        return response.json();
      }).then(function(data) {
        console.log(data);
        if (data.status == "success") {
          declareSuccess();
        }
      });
    } else {
      // Form needs to be filled in.
      if (this.props.topic.value == '') {
        this.props.warnTopic("Topic empty");
      }
      if (this.props.user.email == '') {
        this.props.warnUser("Email empty");
      }
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
          <button type="submit" tabIndex="3">{gon.submit_label}</button>
        </div>
      </form>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchForm);
