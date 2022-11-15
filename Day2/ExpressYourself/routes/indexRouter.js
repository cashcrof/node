const express = require("express");
const indexRouter = express.Router();

const root = process.cwd();

indexRouter.get("/", (req, res) => res.render("index", {title: "Home"}));
indexRouter.get("/about", (req, res) => res.render("about", {title: "About"}));
indexRouter.get("/contact", (req, res) => res.render("contact", {title: "Contact", status: null}));
indexRouter.post("/contact", (req, res) => res.render("contact", {title: "Contact", status: "received", formData: req.body,}));

module.exports = indexRouter;