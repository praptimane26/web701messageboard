const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const MongoClient = require("mongodb").MongoClient;

const app = express();
const port = 3000;
const url = "mongodb://localhost:27017";
const dbName = "messageBoard";
let db;

app.use(bodyParser.json());
app.use(cors());

app.post("/api/message", async (req, res) => {
  const message = req.body;
  console.log(message);
  db.collection("messages").insertOne(message);

  const foundUser = await db
    .collection("users")
    .findOne({ name: message.userName });
  console.log(foundUser);
  if (!foundUser) db.collection("users").insertOne({ name: message.userName });

  res.status(200).send();
});

app.get("/api/message", async (req, res) => {
  const docs = await db.collection("messages").find({}).toArray();
  if (!docs) return res.json({ error: "error getting messages" });

  res.json(docs);
});

MongoClient.connect(url, function (err, client) {
  if (err) return console.log("mongodb error", err);

  console.log("Connected successfully to server");

  db = client.db(dbName);
});

app.listen(port, () => console.log("App running on port", port));
