import React from 'react';
import { connect } from 'react-redux';
import { AutoForm, autoDispatchersByModel } from './AutoForm.jsx'

const mapStateToProps = function(store) {
  return store.location.live
};

const mapDispatchToProps = function(dispatch, ownProps) {
  return Object.assign({
    commitValues: function(value, suggestionObject) {
      dispatch({
        type: 'CHANGE_ALL',
        location: {
          name: value,
          latitude: (suggestionObject.latitude ? suggestionObject.latitude : null),
          longitude: (suggestionObject.longitude ? suggestionObject.longitude : null),
        },
        radius: {
          revealed: true
        },
        step: 3
      })
    }
  }, autoDispatchersByModel(dispatch, "location"))
}

function LocationForm(props) {
  return (
    <div className="location-form">
      <p className="field-prompt">
        Find fellow enthusiasts near:
      </p>
      <AutoForm url='/locations/autocomplete?query='
                warning="Please add a location"
                placeholder="e.g., Fremont, CA, USA"
                {...props} />
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(LocationForm);
