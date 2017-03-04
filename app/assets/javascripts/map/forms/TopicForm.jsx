import React from 'react';
import { connect } from 'react-redux';
import { AutoForm, autoDispatchersByModel } from './AutoForm.jsx'

const mapStateToProps = function(store) {
  return store.topic.live;
}

const mapDispatchToProps = function(dispatch, ownProps) {
  return Object.assign({
    commitValues: function(value, suggestionObject) {
      dispatch({
        type: 'CHANGE_ALL',
        topic: {
          name: value
        },
        location: {
          revealed: true
        },
        step: 2
      });
    }
  }, autoDispatchersByModel(dispatch, "topic"))
}

function TopicForm(props) {
  return (
    <div className="topic-form">
      <p className="field-prompt">
        Find people interested in:
      </p>
      <AutoForm url='/topics/autocomplete?query='
                placeholder="e.g., Basketball, Knitting, Mah Jong, etc."
                warning="Please add a topic"
                {...props} />
    </div>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(TopicForm);
