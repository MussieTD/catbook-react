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
  this.setState({selectedOption: event.target.value});
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
                              checked={this.state.selectedOption === 'problem'}
                              onChange={this.handleRadioChange} />
                Problem
              </label>
            </div>
            <div className="radio">
              <label>
                <input type="radio" value="solution"
                              checked={this.state.selectedOption === 'solution'}
                              onChange={this.handleRadioChange} />
                Solution
              </label>
            </div>
            <div className="radio">
              <label>
                <input type="radio" value="improvement"
                              checked={this.state.selectedOption === 'improvement'}
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
// <form>
//     <div className="radio">
//       <label>
//         <input type="radio" value="option1"
//                       checked={this.state.selectedOption === 'option1'}
//                       onChange={this.handleOptionChange} />
//         Problem
//       </label>
//     </div>
//     <div className="radio">
//       <label>
//         <input type="radio" value="option2"
//                       checked={this.state.selectedOption === 'option2'}
//                       onChange={this.handleOptionChange} />
//         Solution
//       </label>
//     </div>
//     <div className="radio">
//       <label>
//         <input type="radio" value="option3"
//                       checked={this.state.selectedOption === 'option3'}
//                       onChange={this.handleOptionChange} />
//         Improvement
//       </label>
//     </div>
//   </form>
*/

/**
 * New Comment is a New Post component for comments
 *
 * Proptypes
 * @param {string} defaultText is the placeholder text
 * @param {string} storyId to add comment to
 */
// class NewComment extends Component {
//   constructor(props) {
//     super(props);
//   }
//
//   addComment = (value) => {
//     const body = { parent: this.props.storyId, content: value };
//     post("/api/comment", body).then((comment) => {
//       // display this comment on the screen
//       this.props.addNewComment(comment);
//     });
//   };
//
//   render() {
//     return <NewPostInput defaultText="New Comment" onSubmit={this.addComment} />;
//   }
// }

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

// class NewChat extends Component {
//   sendMessage = (value) => {
//     const body = { recipient: this.props.recipient, content: value };
//     post("/api/chat", body);
//   };
//
//   render() {
//     return <NewPostInput defaultText="New Message" onSubmit={this.sendMessage} />;
//   }
// }

export { NewStatement };
