'use strict';

module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment',{
  
    commenterId: DataTypes.INTEGER,
    commenterUsername: DataTypes.STRING,
    text: DataTypes.STRING,
    timestamp: DataTypes.INTEGER
 
  
    
  
  }
  );
  
    
      Comment.associate = models =>{
        // associations can be defined here
        
        Comment.belongsTo(models.Message, {
          foreignKey: {
            allowNull: false
          }
            
          
        })
      }
     
  
  return Comment;
  
  };


















   