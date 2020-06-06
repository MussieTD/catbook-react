import React, { Component } from "react";
import SingleComment from "./SingleComment.js";
import { NewComment } from "./NewFeedBackInput.js";

/**
 * @typedef ContentObject
 * @property {string} _id of story/comment
 * @property {string} creator_name
 * @property {string} content of the story/comment
 */

/**
 * Component that holds all the comments for a story
 *
 * Proptypes
 * @param {ContentObject[]} comments
 * @param {ContentObject} story
 */
class CommentsBlock extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="Card-commentSection">
        <div className="story-comments">
        {this.props.userId && (
          <NewComment storyId={this.props.statement._id} addNewComment={this.props.addNewComment} />
        )}
          {this.props.comments.map((comment) => (
            <SingleComment
              key={`SingleComment_${comment._id}`}
              _id={comment._id}
              creator_name={comment.creator_name}
              creator_id={comment.creator_id}
              content={comment.content}
              userId = {this.props.userId}
            />
          ))}

        </div>
      </div>
    );
  }
}

export default CommentsBlock;
