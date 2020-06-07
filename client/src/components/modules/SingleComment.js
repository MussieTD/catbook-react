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
    if (event.target.value === "Neutral"){ // removing vote
      const body = { schema: "Comment", statement_id: this.props._id, value: this.state.stance , userId: this.props.userId};
      post("/api/unvote", body);
      this.setState({stance: "Neutral" });
    }
    else {
      this.setState({stance: event.target.value });
      const body = { schema: "Comment", statement_id: this.props._id, value: event.target.value , userId: this.props.userId};
      post("/api/vote", body);
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
