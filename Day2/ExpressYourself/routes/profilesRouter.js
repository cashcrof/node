const express = require("express");
const path = require("path");
const fs = require("fs");
const profilesRouter = express.Router();


var obj;
fs.readFile('./data/profiles.json', function(err, data){
    if (err) throw err;
    obj = JSON.parse(data);
})

const viewData= {
    title: "Profiles Listing",
    users: ["cashcroft", "bsmith", "jschmoe"],
  };

profilesRouter.get("/", (req, res) => res.render("profiles", viewData));
profilesRouter.get("/:id", (req, res) => {
    const id = req.params.id;
    for (let i = 0; i < obj.length; i++) {
        if (obj[i].id == id){
            res.render("profile", obj[i]);
        }
        else{
            res.status(404).send("File Not Found");
        }
    }
})

module.exports = profilesRouter;