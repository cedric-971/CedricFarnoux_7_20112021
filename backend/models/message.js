'use strict';

module.exports = (sequelize, DataTypes) => {
const Message = sequelize.define('Message',{

    //userId : DataTypes.INTEGER,
    title: DataTypes.STRING,
    content: DataTypes.STRING,
    attachment: DataTypes.STRING,
    likes: DataTypes.INTEGER

  

}
);

  
    Message.associate = models =>{
      // associations can be defined here
      
      Message.belongsTo(models.User, {
        foreignKey: {
          allowNull: false
        }
          
        
      })
    }
   

return Message;

};