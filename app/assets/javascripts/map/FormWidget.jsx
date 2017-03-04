import React from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';
import TopicForm from './forms/TopicForm.jsx'
import LocationForm from './forms/LocationForm.jsx'
import RadiusForm from './forms/RadiusForm.jsx'
import ConfirmationForm from './forms/ConfirmationForm.jsx'
import FormGuide from './forms/FormGuide.jsx'

const mapStateToProps = function(store) {
  return {
    step: store.step
  }
}

const mapDispatchToProps = function(dispatch, ownProps) {
  return {
  }
}

class FormWidget extends React.Component {
  constructor(props) {
    super(props);

    this.fieldSwitchBoard = this.fieldSwitchBoard.bind(this);
  }

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

export default connect(mapStateToProps, mapDispatchToProps)(FormWidget);
