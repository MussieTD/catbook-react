/*
|--------------------------------------------------------------------------
| api.js -- server routes
|--------------------------------------------------------------------------
|
| This file defines the routes for your server.
|
*/

const express = require("express");

// import models so we can interact with the database
const Story = require("./models/story");
const Comment = require("./models/comment");
const User = require("./models/user");
const Message = require("./models/message");

const Statement = require("./models/statement.js");
const Solution = require("./models/solution.js");

// import authentication library
const auth = require("./auth");

// api endpoints: all these paths will be prefixed with "/api/"
const router = express.Router();

const socket = require("./server-socket");

router.get("/stories", (req, res) => {
  // empty selector means get all documents
  Story.find({}).then((stories) => res.send(stories));
});

router.post("/story", auth.ensureLoggedIn, (req, res) => {
  const newStory = new Story({
    creator_id: req.user._id,
    creator_name: req.user.name,
    content: req.body.content,
  });

  newStory.save().then((story) => res.send(story));
});

router.get("/comment", (req, res) => {
  Comment.find({ parent: req.query.parent }).then((comments) => {
    res.send(comments);
  });
});

router.post("/comment", auth.ensureLoggedIn, (req, res) => {
  const newComment = new Comment({
    creator_id: req.user._id,
    creator_name: req.user.name,
    parent: req.body.parent,
    content: req.body.content,
  });

  newComment.save().then((comment) => res.send(comment));
});

router.get("/solution", (req, res) => {
  Solution.find({ parent: req.query.parent }).then((solutions) => {
    res.send(solutions);
  });
});

router.post("/solution", auth.ensureLoggedIn, (req, res) => {
  const newSolution = new Solution({
    creator_id: req.user._id,
    creator_name: req.user.name,
    parent: req.body.parent,
    content: req.body.content,
  });

  newSolution.save().then((solution) => res.send(solution));
});

// router.get("/votes", (req, res) => {
//   Statement.find({ _id: req.query.id }).then((statement) => {
//     let votes = {support: statement.support, oppose: statement.oppose}
//     res.send(votes);
//   });
// });

router.post("/vote", auth.ensureLoggedIn, (req, res) => {
  const myValue = req.body.value;
  console.log("voting on: ", req.body.schema)

  eval(req.body.schema).findOneAndUpdate({ _id : req.body.statement_id},
    { $inc : { [myValue] :  req.body.change },
      },
    { new : true })
  .then((resp) => {
    console.log("response from update: " + resp);
    res.status(200).send({});
  }).catch((err) => {
    console.log("error saving vote: " + err);
  });
});

router.post("/login", auth.login);
router.post("/logout", auth.logout);
router.post("/initsocket", auth.authenticateSocket);
router.get("/whoami", (req, res) => {
  if (!req.user) {
    // not logged in
    return res.send({});
  }

  res.send(req.user);
});

router.get("/user", (req, res) => {
  User.findById(req.query.userid).then((user) => {
    res.send(user);
  });
});

router.get("/statement", (req, res) => {
  console.log("getting statements on: " + req.query.topic_type);
  Statement.find({ topic_type : req.query.topic_type }).then((statements) => {
    res.send(statements);
  });
});

router.post("/statement", auth.ensureLoggedIn, (req, res) => {
  console.log("posting statement: "  + req.body.topic_type);
  const newStatement = new Statement({
    creator_id: req.user._id,
    creator_name: req.user.name,
    content: req.body.content,
    topic_type: req.body.topic_type,
    content_type: req.body.content_type,
    support: 1,
    oppose: 1,
  });

  newStatement.save().then((statement) => res.send(statement));
});

router.get("/messages", (req, res) => {
  let query;
  if (req.query.recipient_id == "ALL_CHAT") {
    // get any message sent by anybody to ALL_CHAT
    query = { "recipient._id": "ALL_CHAT" };
  } else {
    // get messages that are from me->you OR you->me
    query = {
      $or: [
        { "sender._id": req.user._id, "recipient._id": req.query.recipient_id },
        { "sender._id": req.query.recipient_id, "recipient._id": req.user._id },
      ],
    };
  }

  Message.find(query).then((messages) => res.send(messages));
});

router.post("/chat", auth.ensureLoggedIn, (req, res) => {
  console.log(`Received a chat message: ${req.body.content}`);
  console.log(req.body.recipient);

  // insert this message into the database
  const message = new Message({
    recipient: req.body.recipient,
    sender: {
      _id: req.user._id,
      name: req.user.name,
    },
    content: req.body.content,
  });
  message.save().then((msg) => res.send(msg));

  if (req.body.recipient._id == "ALL_CHAT") {
    socket.getIo().emit("chat", message);
  } else {
    socket
      .getIo()
      .to(req.body.recipient._id)
      .emit("chat", message);
    socket
      .getIo()
      .to(req.user._id)
      .emit("chat", message);
  }
});

router.get("/activeUsers", (req, res) => {
  res.send(socket.getAllConnectedUsers());
});

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;
