const models = require('../models');
const asyncLib = require('async');
const jwtUtils = require('../utils/jwt.utils');

module.exports = {
createComment : function(req, res){

    let headerAuth  = req.headers['authorization'];
    let userId      = jwtUtils.getUserId(headerAuth);

    
    let commenterUsername = req.body.commenterUsername;
    let text = req.body.text;
    let timestamp = Date.now();
    asyncLib.waterfall([
        function(done) {
          models.Message.findOne({
            where: { id: userId }
          })
          .then(function(commenterFound) {
            done(null, commenterFound);
          })
          .catch(function(err) {
            return res.status(500).json({ 'error': 'unable to verify user' });
          });
        },
        function(userFound, done) {
          if(userFound) {
            models.Comment.create({
              commenterId  : commenterFound,
              commenterUsername: commenterUsername,
              text  :text,
              timestamp : timestamp,
              

            })
            .then(function(newComment) {
              done(newComment);
            });
          } else {
            res.status(404).json({ 'error': 'user not found' });
          }
        },
      ], function(newComment) {
        if (newComment) {
          return res.status(201).json(newComment);
        } else {
          return res.status(500).json({ 'error': 'cannot post comment' });
        }
      });
    },
}