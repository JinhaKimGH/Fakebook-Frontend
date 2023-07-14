const User = require("../models/user");
const asyncHandler = require("express-async-handler");

const unicodeDecode = (text) => {
    const decoded = text.replace(/&#x([0-9a-f]+);/gi, (_, code) =>
      String.fromCharCode(parseInt(code, 16))
    );
    return decoded;
};

exports.user_get = asyncHandler(async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        res.json(user)
    } catch (error){
        res.json({ message: "User Not Found." });
    }
})