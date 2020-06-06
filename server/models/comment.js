const mongoose = require("mongoose");

//define a comment schema for the database
const CommentSchema = new mongoose.Schema({
  creator_id: String,
  creator_name: String,
  parent: String, // links to the _id of a parent story (_id is an autogenerated field by Mongoose).
  content: String,
  support: {type: Number, min: 0},
  oppose: {type: Number, min: 0},
  supporters: [String],
  opposers: [String]
});

// compile model from schema
module.exports = mongoose.model("comment", CommentSchema);
