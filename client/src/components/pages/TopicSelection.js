import React, { Component } from "react";
import { NewStory } from "../modules/NewPostInput.js";

import { get } from "../../utilities";

import { Link } from "@reach/router";
import "../modules/StatementCard.css";

class TopicSelection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stories: ["Health","Politics","Education","Infrastructure","Technology"],
    };
  }



  render() {
    let storiesList = null;
      storiesList = this.state.stories.map((storyObj) => (
        <div className="Topic-item">
          <Link to={`/specfeed/${storyObj}`} className="u-link u-bold">
            {storyObj}
          </Link>
        </div>
      ));
            return (
      <div className="Topic-container">
        {storiesList}
      </div>
    );
  }
  }

export default TopicSelection;
