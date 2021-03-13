const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const port = 3000;
const url = "mongodb://localhost:27017/messageBoard";

app.use(bodyParser.json());
app.use(cors());

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));

db.once("open", () => {
  console.log("connected to mongodb");
});

const Message = mongoose.model("Message", {
  userName: String,
  msg: String,
});

const User = mongoose.model("User", {
  name: String,
});

app.post("/api/message", async (req, res) => {
  const message = new Message(req.body);

  message.save();

  const foundUser = await User.findOne({ name: message.userName });
  console.log(foundUser);

  if (!foundUser) new User({ name: message.userName }).save();

  res.status(200).send();
});

app.get("/api/message", async (req, res) => {
  const docs = await Message.find();
  if (!docs) return res.json({ error: "error getting messages" });

  res.json(docs);
});

mongoose.connect(url);

app.listen(port, () => console.log("App running on port", port));
