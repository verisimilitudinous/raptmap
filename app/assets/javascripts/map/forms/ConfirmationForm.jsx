import React from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';

const mapStateToProps = function(store) {
  return {}
}
const mapDispatchToProps = function(dispatch, ownProps) {
  return {}
}

class ConfirmationForm extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="confirmation-form">
        <p className="field-prompt">
          Go!
        </p>
        <form>
          <button type="submit">Submit</button>
        </form>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmationForm);
