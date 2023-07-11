const mongoose = require("mongoose");
const express = require('express');
const cors = require('cors');
const passport = require("passport");
const cookieParser = require('cookie-parser');
const session = require("express-session");
const indexRouter = require('./routes/index');
const jwtStrategy = require("./strategies/jwtStrategy");
const facebookStrategy = require("./strategies/facebookStrategy");
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
app.use(cors());
app.use(passport.initialize());
passport.use(jwtStrategy);
passport.use(facebookStrategy);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);

app.listen(3000, () => {console.log("Server started on port 3000")});