const bcrypt = require("bcrypt");

//const { json } = require("sequelize/types");
const jwtUtils  = require('../utils/jwt.utils');
const models = require("../models");
const asyncLib  = require('async');


const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const passwordRegex = /^(?=.*\d).{4,8}$/;

module.exports = {
  signup: function (req, res) {
    console.log(req.body);
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

    asyncLib.waterfall([
      function(done) {
        models.User.findOne({
          attributes: ['email'],
          where: { email: email }
        })
        .then(function(userFound) {
          done(null, userFound);
        })
        .catch(function(err) {
          return res.status(500).json({ 'error': 'unable to verify user' });
        });
      },
      function(userFound, done) {
        if (!userFound) {
          bcrypt.hash(password, 5, function( err, bcryptedPassword ) {
            done(null, userFound, bcryptedPassword);
          });
        } else {
          return res.status(409).json({ 'error': 'user already exist' });
        }
      },
      function(userFound, bcryptedPassword, done) {
        let newUser = models.User.create({
          email: email,
          username: username,
          password: bcryptedPassword,
          isAdmin: 0
          
        })
        .then(function(newUser) {
          done(newUser);
        })
        .catch(function(err) {
          return res.status(500).json({ 'error': 'cannot add user' });
        });
      }
    ], function(newUser) {
      if (newUser) {
        return res.status(201).json({
          'userId': newUser.id
        });
      } else {
        return res.status(500).json({ 'error': 'cannot add user' });
      }
    });
  },

login: function (req, res, next)  {

  let email = req.body.email;
  let password = req.body.password;

  if(email == null || password == null){
    return res.status(400).json({'error':'missing parameters'});
  }
  asyncLib.waterfall([
    function(done) {
      models.User.findOne({
        where: { email: email }
      })
      .then(function(userFound) {
        done(null, userFound);
      })
      .catch(function(err) {
        return res.status(500).json({ 'error': 'unable to verify user' });
      });
    },
    function(userFound, done) {
      if (userFound) {
        bcrypt.compare(password, userFound.password, function(errBycrypt, resBycrypt) {
          done(null, userFound, resBycrypt);
        });
      } else {
        return res.status(404).json({ 'error': 'user not exist in DB' });
      }
    },
    function(userFound, resBycrypt, done) {
      if(resBycrypt) {
        done(userFound);
      } else {
        return res.status(403).json({ 'error': 'invalid password' });
      }
    }
  ], function(userFound) {
    if (userFound) {
      return res.status(201).json({
        'userId': userFound.id,
        'token': jwtUtils.generateTokenForUser(userFound)
      });
    } else {
      return res.status(500).json({ 'error': 'cannot log on user' });
    }
  });
},
  
  
getUserProfile: function(req, res){

  let headerAuth  = req.headers['authorization'];
  let userId      = jwtUtils.getUserId(headerAuth);

  if (userId < 0)
      return res.status(400).json({ 'error': 'wrong token' });


  models.User.findOne({
    attributes: [ 'id','email','username'],
    where: {id : userId}
  })
    .then(function(user) {
      if (user){
        res.status(201).json(user);

      }else{

        res.status(404).json({'error':'user not found' });
      
      }
     })
    

    .catch(function (err) {
      res.status(500).json({'error': 'cannot fetch user'});
      
    })
    
    

},
updateUserProfile: function(req, res) {
  // Getting auth header
  var headerAuth  = req.headers['authorization'];
  var userId      = jwtUtils.getUserId(headerAuth);

  // Params
  var username = req.body.username;

  asyncLib.waterfall([
    function(done) {
      models.User.findOne({
        attributes: ['id', 'username'],
        where: { id: userId }
      }).then(function (userFound) {
        done(null, userFound);
      })
      .catch(function(err) {
        return res.status(500).json({ 'error': 'unable to verify user' });
      });
    },
    function(userFound, done) {
      if(userFound) {
        userFound.update({
          username: (username ? username : userFound.username)
        }).then(function() {
          done(userFound);
        }).catch(function(err) {
          res.status(500).json({ 'error': 'cannot update user' });
        });
      } else {
        res.status(404).json({ 'error': 'user not found' });
      }
    },
  ], function(userFound) {
    if (userFound) {
      return res.status(201).json(userFound);
    } else {
      return res.status(500).json({ 'error': 'cannot update user profile' });
    }
  });
}
}