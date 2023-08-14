const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const passport = require('passport');

// Decrypts any possible asciicode for symbols
const unicodeDecode = (text) => {
    const decoded = text.replace(/&#x([0-9a-f]+);/gi, (_, code) =>
      String.fromCharCode(parseInt(code, 16))
    );
    return decoded;
};

// Signs the user up and creates an account for them
exports.user_signup_post = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, email, password, gender, birthday } = req.body;

  // Bcrypt used to decode the password
  bcrypt.hash(unicodeDecode(password), 10, async (err, hashedPassword) => {
    if (err) {
      return next(err);
    }
    try {
      // Checks if the email is already associated with a user, if so, an error is returned
      const check = await User.findOne(
        {
          email: email
        });
  
      if (check) {
        res.json(
          { 
            message: "Failure"
          });
      } else {
        const user = new User(
          {
            firstName: firstName,
            lastName: lastName,
            gender: gender,
            birthday: birthday,
            email: email,
            accountCreationDate: new Date(),
            password: hashedPassword
          });

        await user.save();
        res.json(
          {
            message: "Success" 
          });
      }
    } catch (err) {
      res.json(
        {
          message: "Failure"
        });
    }
  })
})

// Logs the user in and checks if the email/password are valid
exports.login_post = asyncHandler(async (req, res, next) => {
  const {email, password} = req.body

  // Sees if the email is associated with a user in the database
  const user = await User.findOne(
    {
      email: email
    });

  // If not an error message is sent back
  if (!user) {
    return res.json(
      {
        message: "Incorrect email or password."
      });
  }

  // Uses bcrypt to compare the password with the encrypted password
  bcrypt.compare(password, user.password, (err, result) => {
    if(result) {
      const options = {};
      const secret = process.env.SECRET;
      const token = jwt.sign(
        {
          email: user.email
        }, secret, options);

      return res.json(
        {
          message: "Success",
          token,
          user,
        });

    } else {
      res.json(
        {
          message: "Incorrect email or password."
        });
    }
  })
})

// Logs the user in with facebook
exports.login_fakebook = [
  // Authenticate with facebook and return token
  passport.authenticate("facebook-token", { session: false }),
  function (req, res) {
    const opts = {};
    const secret = process.env.SECRET;
    const token = jwt.sign(
      { 
        email: req.user.email 
      }, secret, opts);
    res.json(
      { 
        token, 
        user: req.user 
      });
  },
];