const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
//const { json } = require("sequelize/types");

const models = require("../models");
const User = models.user;


const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const passwordRegex = /^(?=.*\d).{4,8}$/;

module.exports = {
  signup: function (req, res) {
    let email = req.body.email;
    let username = req.body.username;
    let password = req.body.password;

    if (email == null || username == null || password == null) {
      return res.status(400).json({ error: "missing parameters" });
    }
    if(username.length >= 13 || username.length <= 4){
      return res.status(400).json({'error':'wrong username(must be length 5 - 12)'})
    }
    if(!emailRegex.test(email)){
      return res.status(400).json({'error': 'email is not valid'})
    }
    if(!passwordRegex.test(password)){
      return res.status(400).json({'error':'password invalid (Password must be between 4 and 8 digits long and include at least one numeric digit).'})
    }

    models.User.findOne({
      attributes: ["email"],
      where: { email: email },
    }).then(function (userFound) {
      if (!userFound) {
        bcrypt.hash(password, 5, function (err, bcryptedPassword) {
          const newUser = models.User.create({
            email: email,
            username: username,
            password: bcryptedPassword,
            isAdmin: 0,
          })
            .then(function (newUser) {
              return res.status(201).json({
                'userId': newUser.id,
              });
            })
            .catch(function (err) {
              return res.status(500).json({ error: "cannot add user" });
            });
        });
      } else {
        return res.status(409).json({ error: "user already exist" });
      }
    })
    .catch(function(err){

      return res.status(500).json({'error':'unable to verify user'});
    });
  },


login: function (req, res, next)  {

  let email = req.body.email;
  let password = req.body.password;

  if(email == null || password == null){
    return res.status(400).json({'error':'missing parameters'});
  }

  models.User.findOne({

    where: {email:email}
    
  })
  .then(function(userFound){

    if(userFound){
      
      bcrypt.compare(password, userFound.password, function(errBycrypt, resBycrypt){
        if(resBycrypt){
          return res.status(200).json({
            userId: userFound.id,
            token: jwt.sign({ userId: userFound._id, isAdmin : userFound.isAdmin  }, process.env.JWT_KEY_SECRET, {
              expiresIn: "24h",
            })
          })
        } else {
          return res.status(403).json({'error':'invalid password'});
        }
      }
      )

    }else{
      return res.status(404).json({'error':'user not exist in DB'})
    }

  })
.catch(function(err){
  return res.status(500).json({'error':'unable to verify user'});

})

},

getOneUser: function(req, res){

 

models.User.findOne({
    attributes: [ 'id','email','username'],
    where: {id : req.params.id}
  })
    .then((function(user) {
      if (user){
        res.status(201).json(user);

      }else{

        res.status(404).json({'error':'user not found' });
      
      }
     }))
    

    .catch(function (err) {
      res.status(500).json({'error': 'cannot fetch user'});
      
    })
    
    

}


}
