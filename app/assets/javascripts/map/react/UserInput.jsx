import React from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';

// See ./TopicForm.jsx for an explanation of mapStateToProps,
// mapDispatchToProps, and the connect() function that appears
// at bottom.

const mapStateToProps = function(store) {
  return Object.assign({input_enabled: store.input_enabled}, store.user);
};

const mapDispatchToProps = function(dispatch, ownProps) {
  return {
    // Changes the user's email.
    changeValue: function(email) {
      dispatch({
        type: 'CHANGE_EMAIL',
        email: email
      })
    },
  };
};

// Our React component. Mostly self-explanatory to React folks.
// Note how the handleChange() and handleSubmit() functions map
// to the Redux dispatch functions defined above in
// mapDispatchToProps().
class UserInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(event) {
    this.props.changeValue(event.target.value, this.props.units);
  }
  render() {
    let opts = {};
    if (this.props.input_enabled !== true) {
      opts['disabled'] = 'disabled'
    };
    return (
      <div className="content-blok user-input">
        <h2>
          <span className="icon-envelope"></span> {gon.user_heading}
        </h2>
        <p className="field-prompt">
          {gon.user_label}
        </p>
        <div className={this.props.warn ? 'field warn' : 'field'}>
          <input type="text"
                 name="user[email]"
                 value={this.props.email}
                 placeholder={(this.props.warn ? gon.user_empty : gon.user_placeholder)}
                 onChange={this.handleChange}
                 tabIndex="2"
                 {...opts}/>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserInput);
