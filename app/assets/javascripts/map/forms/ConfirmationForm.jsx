import React from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';

// ConfirmationForm is the final form of FormWidget. It's
// mostly dead now.

const mapStateToProps = function(store) {
  return {}
}
const mapDispatchToProps = function(dispatch, ownProps) {
  return {}
}

// Not much happening here because the form is not functional.
// The submission bits were ripped out when it became clear that
// FormWidget was bad UI for this app.
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
