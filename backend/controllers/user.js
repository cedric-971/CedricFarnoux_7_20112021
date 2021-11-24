const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

module.exports.signup = async (req, res, next) => {
    const info = {
        email: req.body.email,
        username:req.body.username,
        password:req.body.password, 
        isAdmin: req.body.isAdmin
    }
    try {
        const user = await User.create(info)
        console.log(user);
        res.status(201).json({user:user._id});
    }


    catch(err){
    res.status(200).send({err})
    
}
  
}





