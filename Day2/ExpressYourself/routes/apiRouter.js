const express = require("express");
const apiRouter = express.Router();

apiRouter.get("/api", (req, res) => res.send("api end point!"));

module.exports = apiRouter;