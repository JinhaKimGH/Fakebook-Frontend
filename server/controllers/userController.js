const User = require("../models/user");
const {body, validationResult} = require('express-validator');
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");

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
        res.json("Failure");
      } else {
        const user = new User({firstName: firstName, lastName: lastName, gender: gender, birthday: birthday, email: email, accountCreationDate: new Date(), password: hashedPassword});
        await user.save();
        res.json("Success");
      }
    } catch (err) {
      console.log(error);
      res.json("Failure");
    }
  })


})