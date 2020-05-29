const mongoose = require("mongoose");

//define a story schema for the database
const StatementSchema = new mongoose.Schema({
  creator_id: String,
  creator_name: String,
  content: String,
  content_type: String,
  topic_type: String,

});

// compile model from schema
module.exports = mongoose.model("statement", StatementSchema);
