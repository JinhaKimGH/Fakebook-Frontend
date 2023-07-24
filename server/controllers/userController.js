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
        res.json({user: user})
    } catch (error){
        return res.status(500).json({ message: "User Not Found." });
    }
})

exports.user_update = asyncHandler(async (req, res, next) => {
    const {id, edit_type, content} = req.body;

    try {
        if(edit_type == 'bio'){
            await User.findByIdAndUpdate(id, {'bio': content});
            return res.json({message: "Success"});
        } else if (edit_type == 'gender'){
            await User.findByIdAndUpdate(id, {'gender': content});
            return res.json({message: "Success"});
        } else{
            return res.json({message: "Invalid edit type."})
        }
    } catch (error){
        return res.status(500).json({message: "User Not Found."})
    }
})