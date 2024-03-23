const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const data = require("./data");
const cors = require("cors");

const app = express();
const urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(bodyParser.json());

app.use(cors());

app.get("/users", (req, res) => {
  res.send(data.users);
});

app.get("/users/:id", (req, res) => {
  if (!data.users[req.params.id - 1]) {
    res.status(404).send(`user id ${req.params.id} wasn't found`);
  } else {
    res.send(data.users[req.params.id - 1]);
  }
});

app.post("/users", urlencodedParser, (req, res) => {
  const newUser = req.body;
  newUser.id = String(data.users.length + 1);

  data.users.push(newUser);

  const filePath = path.join(__dirname, "data.js");
  const fileContent = `module.exports = ${JSON.stringify(data, null, 2)};`;

  fs.writeFile(filePath, fileContent, (err) => {
    if (err) {
      console.error("Error writing to data.js file:", err);
      res.status(500).send("Error saving user data.");
    } else {
      console.log("User data saved successfully.");
      res.status(201).send(newUser);
    }
  });
});

app.put("/users/:id", (req, res) => {
  if (!data.users[req.params.id - 1]) {
    res.status(404).send(`user id ${req.params.id} wasn't found`);
  } else {
    Object.assign(data.users[req.params.id - 1], req.body);
    res.send(data.users[req.params.id - 1]);
  }
});

app.listen(5000, () => console.log("Server started on port 5000"));