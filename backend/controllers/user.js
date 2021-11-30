//const bcrypt = require("bcrypt");
//const jwt = require("jsonwebtoken");

const db = require("../models");





module.exports.signup =  (req, res, next) => {
       
    
       db.User.create({
         
        email: req.body.email,
        username:req.body.username,
        password:req.body.password, 
        isAdmin: req.body.isAdmin
    })
    
        .then(() => res.status(201).json({message: "Utilisateur créé !" }))
        .catch((error) => res.status(400).json({ error }));
        
}
        


   module.exports.login = (req, res, next) => {
       
        db.User.findOne({
            where : { email : req.body.email }
        })
       
          .then((user) => {
            if (!user) {
              return res.status(401).json({ error: "Utilisateur non trouvé !" });
          }},

           res.status(200).json({userId: user._id})) 

  
        }
                                                                                                                     

module.exports

    
