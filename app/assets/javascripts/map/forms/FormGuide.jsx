import React from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';

// FormGuide displays a tally of the user's current selections.

// See ../ForwWidget.jsx for an explanation of mapStateToProps,
// mapDispatchToProps, and the connect() function that appears
// at bottom.

const mapStateToProps = function(store) {
  return store
}

const mapDispatchToProps = function(dispatch, ownProps) {
  return {
    // Each form field corresponds to a step.
    // TopicForm = 1
    // LocationForm = 2
    // RadiusForm = 3
    // ConfirmationForm = 4
    // handleLinks() changes the 'step' in the store, which triggers
    // a redraw of FormWidget to show the selected form.
    // See ../FormWidget.jsx for more.
    handleLinks: function(step) {
      dispatch({
        type: 'CHANGE_STEP',
        step: step
      })
    }
  }
}

// When a field's form is active, it should display differently.
// In that case, add "activated" to the active element's class.
function setMenuFieldClass(realStep, fieldStep) {
  const gridClass = "widget-menu-item";
  // If this field's step matches the store's step, activate it.
  return ((realStep == fieldStep) ? (gridClass + " activated") : gridClass);
}

class FormGuide extends React.Component {
  constructor(props) {
    super(props);
    this.composeMenu = this.composeMenu.bind(this);
  }

  // Build up the menu from current state.
  composeMenu() {
    // Determine the topic field's class per setMenuFieldClass().
    let topicMenuClass = setMenuFieldClass(this.props.step, 1);
    // Determine the text label for the topic field.
    let topicMenuText = (this.props.topic.name ? this.props.topic.name : "Topic");
    // Determine whether or not the topic field should be linkable.
    // We don't want this to be a link if the topic field is already
    // displayed (i.e., if the 'step' is already 1).
    let topicMenuPlug = (this.props.step == 1) ?
      (topicMenuText) :
      (<a href="#" onClick={() => this.props.handleLinks(1)}>{topicMenuText}</a>);
    // Construct the topic field element from the above pieces.
    let topicMenuElement = (
      <li className={topicMenuClass}>
        <img src="/images/heart.svg"/>
        <span>{topicMenuPlug}</span>
      </li>
    );

    let locationMenuClass = setMenuFieldClass(this.props.step, 2);
    let locationMenuText = (this.props.location.name ? this.props.location.name : (<em>The Map's Center</em>));
    let locationMenuPlug = (this.props.step == 2) ?
      (locationMenuText) :
      (<a href="#" onClick={() => this.props.handleLinks(2)}>{locationMenuText}</a>);
    let locationMenuElement = (
      <li className={locationMenuClass}>
        <img src="/images/map.svg"/>
        <span>{locationMenuPlug}</span>
      </li>
    );

    let radiusMenuClass = setMenuFieldClass(this.props.step, 3);
    let radiusMenuText = (this.props.radius.length + " " + this.props.radius.units);
    let radiusMenuPlug = (this.props.step == 3) ?
      (radiusMenuText) :
      (<a href="#" onClick={() => this.props.handleLinks(3)}>{radiusMenuText}</a>);
    let radiusMenuElement = (
      <li className={radiusMenuClass}>
        <img src="/images/binoculars.svg"/>
        <span>{radiusMenuPlug}</span>
      </li>
    );

    let readyMenuClass = setMenuFieldClass(this.props.step, 4);
    let readyMenuText = 0;
    let readyMenuPlug = (this.props.step == 4) ?
      (readyMenuText) :
      (<a href="#" onClick={() => this.props.handleLinks(4)}>{readyMenuText}</a>);
    let readyMenuElement = (
      <li className={readyMenuClass}>
        <img src="/images/user.svg"/>
        <span>{readyMenuPlug}</span>
      </li>
    );

    return (
      // Compose the above field elements into the full menu.
      <ul className="widget-menu">
        {topicMenuElement}
        {locationMenuElement}
        {radiusMenuElement}
        {readyMenuElement}
      </ul>
    );
  }

  render() {
    return (
      <div className="form-guide">
        { this.composeMenu() }
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FormGuide);
