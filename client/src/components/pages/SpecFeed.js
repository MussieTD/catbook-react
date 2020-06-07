import React, { Component } from "react";
import Card from "../modules/Card.js";
import { NewStory } from "../modules/NewPostInput.js";

import { get } from "../../utilities";

import { Link } from "@reach/router";

import { NewStatement }  from "../modules/NewStatementInput.js"
import StatementCard from "../modules/StatementCard.js";

class SpecFeed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: undefined,
      statements: [],
    };
  }

  // called when the "Feed" component "mounts", i.e.
  // when it shows up on screen
  componentDidMount() {
    document.title = "Topical News Feed: " + this.props.topic_type;
    get("/api/statement", { topic_type : this.props.topic_type }).then((storyObjs) => {
      let reversedStoryObjs = storyObjs.reverse();
      reversedStoryObjs.map((storyObj) => {
        this.setState({ statements: this.state.statements.concat([storyObj]) });
      });
    });
  }


  addNewStatement = (statement) => {
    this.setState({
      statements: [statement].concat(this.state.statements),
    });
  };

  render() {
    let storiesList = null;
    const hasStories = this.state.statements.length !== 0;
    if (hasStories) {
      storiesList = this.state.statements.map((storyObj) => (
        <StatementCard
          key={`Card_${storyObj._id}`}
          _id={storyObj._id}
          creator_name={storyObj.creator_name}
          creator_id={storyObj.creator_id}
          content={storyObj.content}
          userId={this.props.userId}
          content_type={storyObj.content_type}
          topic_type={storyObj.topic_type}
          support={storyObj.support}
          oppose={storyObj.oppose}
        />
      ));
    } else {
      storiesList = <div>No statements!</div>;
    }
    return (
      <>
        {this.props.userId && <NewStatement addNewStatement={this.addNewStatement} topic_type={this.props.topic_type}/>}
        {storiesList}
      </>
    );
  }
}

export default SpecFeed;
