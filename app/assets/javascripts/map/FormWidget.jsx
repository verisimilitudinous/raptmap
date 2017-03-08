import React from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';
import TopicForm from './forms/TopicForm.jsx'
import LocationForm from './forms/LocationForm.jsx'
import RadiusForm from './forms/RadiusForm.jsx'
import ConfirmationForm from './forms/ConfirmationForm.jsx'
import FormGuide from './forms/FormGuide.jsx'

// ForwWidget is the primary component of this React app.
// It allows the user to interact with a succession of form fields.

// mapStateToProps is used by react-redux. It's used to translate the
// store's state into the component's props. But there's not much to do
// here because this component only uses the store's 'step' attribute.
// See the connect() function at bottom. Also:
// http://redux.js.org/docs/basics/UsageWithReact.html#implementing-container-components
const mapStateToProps = function(store) {
  return {
    step: store.step
  }
}

// Likewise, mapStateToProps is also used by react-redux's connect()
// function. It's used to define functions for altering state, which
// then get added to the component's props for use. But since this
// component does not alter state, there's nothing to do here.
// http://redux.js.org/docs/basics/UsageWithReact.html#implementing-container-components
const mapDispatchToProps = function(dispatch, ownProps) {
  return {
  }
}

// Our React component, FormWidget.
class FormWidget extends React.Component {
  constructor(props) {
    super(props);
    this.fieldSwitchBoard = this.fieldSwitchBoard.bind(this);
  }

  // This displays the correct form based upon the step field in the store.
  fieldSwitchBoard() {
    switch (this.props.step) {
    case 1:
      return (<TopicForm/>)
    case 2:
      return (<LocationForm/>)
    case 3:
      return (<RadiusForm/>)
    case 4:
      return (<ConfirmationForm/>)
    }
  }

  render() {
    return (
      <div className="content-blok react-form">
        <FormGuide/>
        {this.fieldSwitchBoard()}
      </div>
    )
  }
}

// As mentioned above, this is where we wire the store into
// the component's props with react-redux's connect().
// http://redux.js.org/docs/basics/UsageWithReact.html
export default connect(mapStateToProps, mapDispatchToProps)(FormWidget);
