import React, { Component } from "react";
import { Link } from "@reach/router";
import { post } from "../../utilities";

/**
 * Component to render a single comment
 *
 * Proptypes
 * @param {string} _id of comment
 * @param {string} creator_name
 * @param {string} creator_id
 * @param {string} content of the comment
 */
class SingleComment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stance: "Neutral",
    };
  }

  handleStanceChange = (event) => {
    console.log("stance change: " + this.state.stance + " " + event.target.value)
    if (event.target.value === "Neutral"){ // removing vote
      const body = { schema: "Comment", statement_id: this.props._id, value: this.state.stance ,change: -1};
      post("/api/vote", body).then((vote) => {});
      this.setState({stance: "Neutral" });
    }
    else {
      this.setState({stance: event.target.value });
      const body = { schema: "Comment", statement_id: this.props._id, value: event.target.value ,change: 1};
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
      <div className="Card-commentBody">
        <Link to={`/profile/${this.props.creator_id}`} className="u-link u-bold">
          {this.props.creator_name}
        </Link>
        <span>{" | " + this.props.content}</span>
        { this.props.userId &&

         (<form>
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
           </form>)

       }
      </div>

    );
  }
}

export default SingleComment;
