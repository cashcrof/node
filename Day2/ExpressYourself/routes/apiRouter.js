const fs = require("fs").promises;
const path = require("path");

const express = require("express");
const apiRouter = express.Router();

const dataPath = path.join(__dirname, "../data/");

apiRouter.get("/", (req, res) => res.end("This is the api endpoint"))

apiRouter.get("/profiles", (req, res) => {
  fs.readFile(dataPath + "profiles.json")
    .then((contents) => {
      const profilesJson = JSON.parse(contents);
      res.json(profilesJson);
    })
    .catch((err) => {
      console.log(err);
      res.writeHead(500);
      res.end("Error");
    });
});

apiRouter.get("/profiles/:id", (req, res) => {
  fs.readFile(dataPath + "profiles.json")
    .then((contents) => {
      const profilesJson = JSON.parse(contents);
      const profileJson = profilesJson
        .filter((profile) => profile.id === req.params.id)
        .shift();
      res.json(profileJson);
    })
    .catch((err) => {
      console.log(err);
      res.writeHead(500);
      res.end("Error");
    });
});

apiRouter.get("/quotes", (req, res) => {
  fs.readFile(dataPath + "quotes.json")
    .then((contents) => {
      const quotesJSON = JSON.parse(contents);
      res.json(quotesJSON);
    })
    .catch((err) => {
      console.log(err);
      res.writeHead(500);
      res.end("Error");
    });
});

module.exports = apiRouter;
