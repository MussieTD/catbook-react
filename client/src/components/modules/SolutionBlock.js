import React, { Component } from "react";
import SingleComment from "./SingleComment.js";
// import { NewComment, NewSolution } from "./NewPostInput.js";
import { NewComment, NewSolution } from "./NewFeedBackInput.js";
import { Link } from "@reach/router";

/**
 * @typedef ContentObject
 * @property {string} _id of story/comment
 * @property {string} creator_name
 * @property {string} content of the story/comment
 */

/**
 * Component that holds all the comments for a story
 * Proptypes
 * @param {ContentObject[]} comments
 * @param {ContentObject} story
 */
class SolutionBlock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stance: "Neutral",
    };
  }

  handleStanceChange = (event) => {
    console.log("stance change: " + this.state.stance + " " + event.target.value)
    if (event.target.value === "Neutral"){ // removing vote
      const body = { schema: "Solution" , statement_id: this.props._id, value: this.state.stance ,change: -1};
      post("/api/vote", body).then((vote) => {});
      this.setState({stance: "Neutral" });
    }
    else {
      this.setState({stance: event.target.value });
      const body = { schema: "Solution" , statement_id: this.props._id, value: event.target.value ,change: 1};
      console.log("sc ln 72");

      post("/api/vote", body).then((comment) => {
        console.log("sc ln 73");
        // display this comment on the screen
        // this.props.addNewSolution(comment);
      });
    }
  };

  render() {
    return (
      <div className="Card-commentSection">
        <div className="story-comments">
        {this.props.userId && (
          <NewSolution statementId={this.props.statement._id} addNewSolution={this.props.addNewSolution} />
        )}
          {this.props.solutions.map((solution) => (
            <div className="Card-commentBody">
              <Link to={`/profile/${solution.creator_id}`} className="u-link u-bold">
                {solution.creator_name}
              </Link>
              <span>{" | " + solution.content}</span>
            </div>




          ))}
        </div>
      </div>
    );
  }
}

export default SolutionBlock;
