import React, { Component } from "react";
import SingleStory from "./SingleStory.js";
import CommentsBlock from "./CommentsBlock.js";
import { get , post } from "../../utilities";

import "./Card.css";


import { Link } from "@reach/router";
import SolutionBlock from "./SolutionBlock.js";

/**
 * Card is a component for displaying content like stories
 *
 * Proptypes
 * @param {string} _id of the story
 * @param {string} creator_name
 * @param {string} creator_id
 * @param {string} content of the story
 */
class StatementCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: [],
      solutions: [],
      showSolution: false,
      stance: "Neutral",
    };
  }

  componentDidMount() {
    get("/api/comment", { parent: this.props._id }).then((comments) => {
      this.setState({
        comments: comments,
      });
    });

    get("/api/solution", { parent: this.props._id }).then((solutions) => {
      this.setState({
        solutions: solutions,
      });
    });
  }

  // this gets called when the user pushes "Submit", so their
  // post gets added to the screen right away
  addNewComment = (commentObj) => {
    this.setState({
      comments: this.state.comments.concat([commentObj]),
    });
  };

  addNewSolution = (solutionObj) => {
    this.setState({
      solutions: this.state.solutions.concat([solutionObj]),
    });
  };

  handleSolutionViewChange = (event) => {
    this.setState({showSolution: event.target.value === "solution"});
  };

  handleStanceChange = (event) => {
    console.log("stance change: " + this.state.stance + " " + event.target.value)
    if (event.target.value === "Neutral"){ // removing vote
      const body = { schema: "Statement", statement_id: this.props._id, value: this.state.stance , userId: this.props.userId};
      post("/api/unvote", body);
      this.setState({stance: "Neutral" });
    }
    else {
      this.setState({stance: event.target.value });
      const body = { schema: "Statement", statement_id: this.props._id, value: event.target.value , userId: this.props.userId};
      post("/api/vote", body);
    }
  };

  render() {
    return (
      <div className="Card-container">
      <div className="Card-story">
        <Link to={`/profile/${this.props.creator_id}`} className="u-link u-bold">
          {this.props.creator_name}
        </Link>
        <p className="Card-storyContent">{this.props.content}</p>
        <p className="Card-storyContent">{this.props.content_type}</p>
        <p className="Card-storyContent">{this.props.topic_type}</p>
        <p className="Card-storyContent">{(this.props.support).length}</p>
        <p className="Card-storyContent">{(this.props.oppose).length}</p>
      </div>
      <hr/>
      <form>
          <div className="radio">
            <label>
              <input type="radio" value="comment"
                            checked={!this.state.showSolution}
                            onClick={this.handleSolutionViewChange} />
              comment
            </label>
          </div>
          <div className="radio">
            <label>
              <input type="radio" value="solution"
                            checked={this.state.showSolution}
                            onClick={this.handleSolutionViewChange} />
              solution
            </label>
            </div>
        </form>
        <hr/>
        <form>
            <div className="radio">
              <label>
                <input type="radio" value="support"
                              checked={this.state.stance === "support"}
                              onChange={this.handleStanceChange} />
                support
              </label>
            </div>
            <div className="radio">
              <label>
                <input type="radio" value="oppose"
                              checked={this.state.stance === "oppose"}
                              onChange={this.handleStanceChange} />
                oppose
              </label>
              </div>
              { this.state.stance != "Neutral" && <div className="radio">
                <label>
                  <input type="radio" value="Neutral"
                                checked={this.state.stance === "Neutral"}
                                onChange={this.handleStanceChange} />
                  neutralize vote:
                </label>
                </div> }
          </form>
      { !this.state.showSolution &&
        <CommentsBlock
          statement={this.props}
          comments={this.state.comments}
          addNewComment={this.addNewComment}
          userId={this.props.userId}
        /> }
        { this.state.showSolution && this.props.content_type != "improvement" && <SolutionBlock
          statement={this.props}
          solutions={this.state.solutions}
          addNewSolution={this.addNewSolution}
          userId={this.props.userId}
        />}
      </div>
    );
  }
}

export default StatementCard;
