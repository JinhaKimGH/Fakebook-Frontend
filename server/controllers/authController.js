const User = require("../models/user");
const {body, validationResult} = require('express-validator');
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const passport = require('passport');

const unicodeDecode = (text) => {
    const decoded = text.replace(/&#x([0-9a-f]+);/gi, (_, code) =>
      String.fromCharCode(parseInt(code, 16))
    );
    return decoded;
};

exports.user_signup_post = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, email, password, gender, birthday } = req.body;

  bcrypt.hash(unicodeDecode(password), 10, async (err, hashedPassword) => {
    if (err) {
      return next(err);
    }
    try {
      const check = await User.findOne({email: email});
  
      if (check) {
        res.json({ message: "Failure" });
      } else {
        const user = new User({firstName: firstName, lastName: lastName, gender: gender, birthday: birthday, email: email, accountCreationDate: new Date(), password: hashedPassword});
        await user.save();
        res.json({ message: "Success" });
      }
    } catch (err) {
      console.log(err);
      res.json({message: "Failure"});
    }
  })
})

exports.login_post = asyncHandler(async (req, res, next) => {
  const {email, password} = req.body
  const user = await User.findOne({email: email});
  if (!user) {
    return res.json({message: "Incorrect email or password."});
  }

  bcrypt.compare(password, user.password, (err, result) => {
    if(result) {
      const options = {};
      const secret = process.env.SECRET;
      const token = jwt.sign({email: user.email}, secret, options);
      return res.json({
        message: "Success",
        token,
        user,
      });
    } else {
      res.json({message: "Incorrect email or password."})
    }
  })
})

exports.login_fakebook = [
  // Authenticate with facebook and return token for OdinBook
  passport.authenticate("facebook-token", { session: false, scope: ['email', ] }),
  function (req, res) {
    const opts = {};
    opts.expiresIn = "24h";
    const secret = process.env.SECRET;
    const token = jwt.sign({ email: req.user.email }, secret, opts);
    res.json({ token, user: req.user });
  },
];