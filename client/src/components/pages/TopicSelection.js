import React, { Component } from "react";
import Card from "../modules/Card.js";
import { NewStory } from "../modules/NewPostInput.js";

import { get } from "../../utilities";

import { Link } from "@reach/router";

class TopicSelection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stories: ["Health","Politics","Education"],
    };
  }



  render() {
    console.log("rendering topic selection");
    let storiesList = null;
      storiesList = this.state.stories.map((storyObj) => (
        <div className="Card-story">
          <Link to={`/specfeed/${storyObj}`} className="u-link u-bold">
            {storyObj}
          </Link>
        </div>
      ));
            return (
      <>
        {storiesList}
      </>
    );
  }
  }

export default TopicSelection;
