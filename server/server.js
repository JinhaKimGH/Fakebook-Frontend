const mongoose = require("mongoose");
const express = require('express');
const cors = require('cors');
const passport = require("passport");
const cookieParser = require('cookie-parser');
const session = require("express-session");
const indexRouter = require('./routes/index');
require('dotenv').config()


const app = express();

// Set up mongoose connection
mongoose.set("strictQuery", false);
const mongoDB = process.env.MONGODBURI;

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

// Set up
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
  if ('OPTIONS' == req.method) {
       res.sendStatus(200);
   } else {
       next();
   }
  });
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors({origin: process.env.ORIGINLINK, credentials: true, allowedHeaders: ['Content-Type']}));
app.use(session({ secret: "secretcode", resave: false, saveUninitialized: false}));
app.use(cookieParser("secretcode"));
app.use(passport.initialize());
app.use(passport.session());


app.use('/', indexRouter);

app.listen(3000, () => {console.log("Server started on port 3000")});