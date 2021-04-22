const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path=require("path");
var jsonfile = require('jsonfile');
require("dotenv").config();
var morgan = require('morgan');
var winston = require('./winston');
// const bcrypt = require("bcryptjs");
// const Datastore = require("nedb");
// const jwt = require("jsonwebtoken");
const app = express();
// const db = {};
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
app.use(helmet());
app.use(cors());
const port = 7777;
const user = require("./routes/user");
// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// app.use(morgan('combined', { stream: winston.stream }));
// *** config file *** //
const db = require("./dbConfig").mongoURI[app.settings.env];

// Connect to MongoDB
mongoose
  .connect(db, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => console.log("MongoDB Connected: ", app.settings.env))
  .catch((err) => console.log(err));
  // console.log(app.settings);


// create our router
const router = express.Router();
// REGISTER OUR ROUTES -------------------------------
app.use("/api/", user);
app.use("/", router);
app.use(express.static(path.resolve(__dirname, "build")));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Use Routes

app.get("/json/:file",function(req,res){

  var fileName = req.params.file;
  var file = path.normalize(__dirname + '/build/static/' + fileName+".json");
  // console.log('path: ' + file);

  jsonfile.readFile(file, function(err, obj) {
    if(err) {
      res.json({status: 'error', reason: err.toString()});
      return;
    }

    res.json(obj);
  });
});
app.get("*", function (req, res) {
  // console.log(req);
  res.sendFile(path.resolve(__dirname, "build","index.html"));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development

  // res.locals.message = err.message;
  // res.locals.error = req.app.get('env') === 'development' ? err : {};

  // add this line to include winston logging
  //winston.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

  // render the error page
  res.status(err.status || 500).json({message:'error'});
});


//////////////end error handling middleware////////////////////////

app.listen(port, () => console.log(`Server is running on port ${port}!`));

// var server=app.listen(port, () => console.log(`Server is running on port ${port}!`));
// var io = require('socket.io').listen(server);
// io.on('connection', (socket) => {
// });
module.exports = app;
