const http = require("http");
const logger = require('morgan');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const indexRouter = require("./routes/indexRouter");
const apiRouter = require("./routes/apiRouter");
const profilesRouter = require("./routes/profilesRouter");

app.set("views", path.join(__dirname, "views"));
app.set('view engine', 'ejs');
app.use(express.static('public')); 
app.use('/images', express.static('images'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const hostname = "127.0.0.1";
const PORT = process.env.PORT || 3003;

app.use(logger('dev'));
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });

app.use(indexRouter);
app.use(apiRouter);
app.use('/profiles', profilesRouter);

// catch any unmatched routes
app.all("/*", (req, res) => {
    res.status(404).send("File Not Found");
  });