import React from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';
import SearchForm from './SearchForm.jsx'
import CreationNotification from './CreationNotification.jsx'

// Switches between different views.
// Mostly dumb. You only have one job to do...

const mapStateToProps = function(store) {
  return store;
}

const mapDispatchToProps = function(dispatch, ownProps) {
  return {}
}

// Nothing fancy here.
function Switchboard(props) {
  return (
    (props.created === false) ? <SearchForm/> : <CreationNotification/>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Switchboard);
