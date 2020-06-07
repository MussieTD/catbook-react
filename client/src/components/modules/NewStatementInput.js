import React, { Component } from "react";

import "./NewPostInput.css";
import { post } from "../../utilities";

/**
 * New Post is a parent component for all input components
 *
 * Proptypes
 * @param {string} defaultText is the placeholder text
 * @param {string} storyId optional prop, used for comments
 * @param {({storyId, value}) => void} onSubmit: (function) triggered when this post is submitted, takes {storyId, value} as parameters
 */
class NewStatementInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: "",
      contentType: "Problem",
    };
  }



  // called whenever the user types in the new post input box
  handleChange = (event) => {
    this.setState({
      value: event.target.value,
    });
  };

  // called when the user hits "Submit" for a new post
  handleSubmit = (event) => {
    event.preventDefault();
    this.props.onSubmit && this.props.onSubmit(this.state.value, this.state.contentType, this.props.topicType);
    console.log("mid sibmission");
    this.setState({
      value: "",
      contentType: "Problem",
    });
  };

handleRadioChange = (event) => {
  console.log("event: ", event.target.value)
  this.setState({contentType: event.target.value});
};

  render() {
    return (
      <div className="u-flex">
        <input
          type="text"
          placeholder= {this.props.defaultText}
          value={this.state.value}
          onChange={this.handleChange}
          className="NewPostInput-input"
        />
        <form>
            <div className="radio">
              <label>
                <input type="radio" value="problem"
                              checked={this.state.contentType === 'problem'}
                              onChange={this.handleRadioChange} />
                Problem
              </label>
            </div>
            <div className="radio">
              <label>
                <input type="radio" value="improvement"
                              checked={this.state.contentType === 'improvement'}
                              onChange={this.handleRadioChange} />
                Improvement
              </label>
            </div>
          </form>
        <button
          type="submit"
          className="NewPostInput-button u-pointer"
          value="Submit"
          onClick={this.handleSubmit}
        >
          Submit
        </button>
      </div>
    );
  }
}

/**
 * New Story is a New Post component for comments
 *
 * Proptypes
 * @param {string} defaultText is the placeholder text
 */
class NewStatement extends Component {
  addStatement = (value, contentType) => {
    const body = { content: value , content_type : contentType, topic_type: this.props.topic_type};
    console.log("passing as body: " + body.topic_type);
    post("/api/statement", body)
    .then((story) => {
      // display this story on the screen
      console.log("statement posted: " + story)
      this.props.addNewStatement(story);
    })
    .catch((error) => {
      // give a useful error message
      console.log("posting statement error: ", error);
    });
   };

  render() {
    return <NewStatementInput defaultText="New Story" onSubmit={this.addStatement} topic_type={this.props.topic_type} />;
  }
}

export { NewStatement };
