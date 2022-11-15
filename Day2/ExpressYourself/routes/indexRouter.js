const express = require("express");
const indexRouter = express.Router();

const root = process.cwd();

indexRouter.get("/", (req, res) => res.render(root + "/views/index.ejs"));
indexRouter.get("/about", (req, res) => res.render(root + "/views/about.ejs"));
indexRouter.get("/contact", (req, res) => res.render(root + "/views/contact.ejs"));
indexRouter.post("/contact", (req, res) => res.send("Thank you for submitting."));

module.exports = indexRouter;