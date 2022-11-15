const express = require("express");
const path = require("path");
const fs = require("fs").promises;
const profilesRouter = express.Router();
const dataPath = path.join(__dirname, "../data/");

// var obj;
// fs.readFile(dataPath + 'profiles.json', function(err, data){
//     if (err) throw err;
//     obj = JSON.parse(data);
// })

// const viewData= {
//     title: "Profiles Listing",
//     users: ["cashcroft", "bsmith", "jschmoe"],
//   };

profilesRouter.get("/", (req, res) => {
    fs.readFile(dataPath + "profiles.json")
    .then((contents) => {
        const profilesJson = JSON.parse(contents);
        res.render("profiles", {
            title: "Express Yourself - Profiles",
            profiles: profilesJson,
          });
    })
    .catch((err) => {
        console.log(err);
        res.writeHead(500);
        res.end("Error");
      });
});

profilesRouter.get("/:id", (req, res) => {
    fs.readFile(dataPath + "profiles.json")
    .then((contents) => {
        const profilesJson = JSON.parse(contents);
        const profileJson = profilesJson.filter((profile) => profile.id === req.params.id).shift();

        res.render("profile", {
        title: "Express Yourself - " + profileJson.name,
        profiles: profilesJson,
        profileId: req.params.id,
        layout: "./layouts/sidebar"
        });
    })
    .catch((err) => {
        res.status(404).end("Profile Not Found");
    });
});

module.exports = profilesRouter; 