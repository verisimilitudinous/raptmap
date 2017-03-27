import React from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';

// Displayed when a subscription is successfully created.

// Let's give it access to the store for posterity.
// I have no immediate plans to use the store but that's
// probably going to change within the next five minutes.

const mapStateToProps = function(store) {
  return store;
}

const mapDispatchToProps = function(dispatch, ownProps) {
  return {}
}

// Nothing fancy here.
function CreationNotification(props) {
  return (
    <div className="creation-notification">
      <div className="content-blok">
        <h2>
          <span className="icon-send"></span> {gon.create.success_heading}
        </h2>
        <p>
          {gon.create.success_summary_html}
        </p>
      </div>
      <div className="content-blok">
        <h2>
          <span className="icon-search"></span> {gon.create.again_heading}
        </h2>
        <p>
          {gon.create.again_summary_html}
        </p>
        <a>{gon.create.again_link_label}</a>
      </div>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(CreationNotification);
