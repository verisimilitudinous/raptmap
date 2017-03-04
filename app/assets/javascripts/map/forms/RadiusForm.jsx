import React from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';

const mapStateToProps = function(store) {
  return store.radius
};

function convertToMeters(length, units) {
  switch (units) {
  case "km":
    return (length*1000);
  case "m":
    return (length*1);
  case "mi":
    return (length*1609.34);
  case "ft":
    return (length*0.3048);
  };
};

const mapDispatchToProps = function(dispatch, ownProps) {
  return {
    commitValues: function(length, units) {
      dispatch({
        type: 'CHANGE_RADIUS',
        radius: {
          length: length,
          units: units,
          in_meters: convertToMeters(length, units),
        },
        step: 4
      })
    },
    toggleWarning: function(boolean, length, units) {
      dispatch({
        type: 'CHANGE_RADIUS',
        radius: {
          length: length ? length : 0,
          in_meters: length ? convertToMeters(length, units) : 0,
          warn: boolean
        }
      })
    },
    changeLength: function(length, units) {
      dispatch({
        type: 'CHANGE_RADIUS',
        radius: {
          length: length,
          in_meters: convertToMeters(length, units),
          warn: false
        }
      })
    },
    changeUnits: function(units, length) {
      dispatch({
        type: 'CHANGE_RADIUS',
        radius: {
          units: units,
          in_meters: convertToMeters(length, units)
        }
      })
    }
  };
};

class RadiusForm extends React.Component {
  constructor(props) {
    super(props);

    this.handleLengthChange = this.handleLengthChange.bind(this);
    this.handleUnitsChange = this.handleUnitsChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleLengthChange(event) {
    this.props.changeLength(event.target.value, this.props.units);
  }
  handleUnitsChange(event) {
    this.props.changeUnits(event.target.value, this.props.length);
  }
  handleSubmit(event) {
    if (this.props.length !== '') {
      this.props.commitValues(this.props.length, this.props.units);
    } else {
      this.props.toggleWarning(true, this.props.length, this.props.units);
    };
    event.preventDefault();
  }
  render() {
    return (
      <div className="radius-form">
        <p className="field-prompt">
          Search in every direction for:
        </p>
        <form onSubmit={this.handleSubmit}>
          <div className={this.props.warn ? 'field warn' : 'field'}>
            <input autoFocus
                   type="number"
                   value={this.props.length}
                   onChange={this.handleLengthChange} />
            <select value={this.props.units} onChange={this.handleUnitsChange}>
              <option value="km">{(this.props.length == 1) ? "kilometer" : "kilometers"}</option>
              <option value="m">{(this.props.length == 1) ? "meter" : "meters"}</option>
              <option value="mi">{(this.props.length == 1) ? "mile" : "miles"}</option>
              <option value="ft">{(this.props.length == 1) ? "foot" : "feet"}</option>
            </select>
          </div>
          <button className="pure-button pure-button-primary" type="submit">Submit</button>
        </form>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RadiusForm);
