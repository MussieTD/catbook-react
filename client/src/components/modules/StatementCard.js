import React, { Component } from "react";
import SingleStory from "./SingleStory.js";
import CommentsBlock from "./CommentsBlock.js";
import { get , post } from "../../utilities";

import "./StatementCard.css";


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
      stance: this.getVote(),

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


  getVote = () => {
    if (this.props.support.includes(this.props.userId)){
      this.setState({stance : "support"});
    }
    else if (this.props.oppose.includes(this.props.userId)){
      this.setState({stance : "oppose"});
    }
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
        <div className="Card-info">
          <Link to={`/profile/${this.props.creator_id}`} className="u-link u-bold">
            {this.props.creator_name}
          </Link>
          <div className="Card-topicType"> {this.props.topic_type}</div>
          <div className="Card-contentType"> {this.props.content_type} </div>
        </div>
        <div className="Card-storyContent">{this.props.content}</div>
        <div className="Stance">
          <div className="Stance-show">
            <div> Supporters: {(this.props.support).length + (this.state.stance == "support" && !this.props.support.includes(this.props.userId) ? 1 : 0)} </div>
            <div> Opposers: {(this.props.oppose).length + (this.state.stance == "oppose" && !this.props.oppose.includes(this.props.userId) ? 1 : 0) } </div>
          </div>

          {this.props.userId && <form className="radios">
                {this.state.stance === "Neutral" && <label>
                Support:
                  <input type="radio" value="support"
                                checked={this.state.stance === "support"}
                                onChange={this.handleStanceChange} />

                </label>}
                {this.state.stance === "Neutral" && <label>
                Oppose:
                  <input type="radio" value="oppose"
                                checked={this.state.stance === "oppose"}
                                onChange={this.handleStanceChange} />

                </label>}
                { this.state.stance != "Neutral" &&
                  <label>
                  Neutralize vote:
                    <input type="radio" value="Neutral"
                                  checked={this.state.stance === "Neutral"}
                                  onChange={this.handleStanceChange} />

                  </label> }
            </form> }
        </div>


      <hr/>

      <form className="radios">
            <label>
            Show:
            </label>
            <label>
              <input type="radio" value="comment"
                            checked={!this.state.showSolution}
                            onClick={this.handleSolutionViewChange} />
              comment
            </label>


            <label>
              <input type="radio" value="solution"
                            checked={this.state.showSolution}
                            onClick={this.handleSolutionViewChange} />
              solution
            </label>

        </form>

        <hr/>

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
