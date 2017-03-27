import React from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';

const mapStateToProps = function(store) {
  return store;
}

const mapDispatchToProps = function(dispatch, ownProps) {
  return {}
}

// LocationForm is just a sign that points to the map.
function LocationInput(props) {
  return (
    <div className="content-blok location-input">
      <h2>
        <span className="icon-map"></span> {gon.map_heading}
      </h2>
      <p className="field-prompt">
        {gon.map_label} <span className="icon-arrow-right"></span>
      </p>
      <input type="hidden" name="location[latitude]" value={props.location.latitude} />
      <input type="hidden" name="location[longitude]" value={props.location.longitude} />
      <input type="hidden" name="location[radius_length]" value={props.radius.length} />
      <input type="hidden" name="location[radius_units]" value="m" />
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(LocationInput);
