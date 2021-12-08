const models = require('../models');




module.exports = {

createMessage: function(req , res){

    let title = req.body.title;
    let content = req.body.content;  
  
    if(title == null || content == null){
        return res.status(400).json({'error': 'missing parameters '});
    }
 if(title.length <= 2 || content.length <= 4){
   return res.status(400).json({'error' : 'invalid parameters'});
 }
  
  models.User.findOne({
      where : {id: userId}
  })
   .then(function(userFound){

    if(userFound){
        models.Message.create({

            title : title,
            content : content,
            likes : 0,
            UserId :userFound.id
        })
        .then(function(newMessage){
        if(newMessage){
            return res.status(201).json(newMessage); 

            }else{
                return res.status(500).json({'error':'cannot post message'});
            }
        })
        
    
    }else{
         res.status(404).json({'error':'user not found'})
    }

   })   
   



   




},
listMessages : function (req, res) {
models.Message.findAll({
    
include: [{

    model: models.User,
    attributes : ['username']
}]
    
}).then(function(messages) {
    if (messages) {
      res.status(200).json(messages);
    } else {
      res.status(404).json({ "error": "No messages found" });
    }
  }).catch(function(err) {
    res.status(404).json({ "error": "No user found" });

    
});






}
}