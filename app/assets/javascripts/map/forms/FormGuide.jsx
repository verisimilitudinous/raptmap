import React from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';

const mapStateToProps = function(store) {
  return store
}

const mapDispatchToProps = function(dispatch, ownProps) {
  return {
    handleLinks: function(step) {
      dispatch({
        type: 'CHANGE_STEP',
        step: step
      })
    }
  }
}

function setMenuFieldClass(realStep, fieldStep) {
  const gridClass = "widget-menu-item";
  return ((realStep == fieldStep) ? (gridClass + " activated") : gridClass);
}

class FormGuide extends React.Component {
  constructor(props) {
    super(props);
    this.composeMenu = this.composeMenu.bind(this);
  }

  composeMenu() {
    let topicMenuClass = setMenuFieldClass(this.props.step, 1);
    let topicMenuText = (this.props.topic.name ? this.props.topic.name : "Topic");
    let topicMenuPlug = (this.props.step == 1) ?
      (topicMenuText) :
      (<a href="#" onClick={() => this.props.handleLinks(1)}>{topicMenuText}</a>);
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
