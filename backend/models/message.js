'use strict';

module.exports = (sequelize, DataTypes) => {
const Message = sequelize.define('Message',{
  
  title: {type: DataTypes.STRING
  },
  content: { type: DataTypes.STRING
  },
  attachment: { type: DataTypes.STRING
  },
  likes: { type: DataTypes.INTEGER
  }

},{


classMethods:{



    associate : function(models){

    
      models.Message.belongsTo(models.User,{
        foreignKey:{
          allowNull: false
        }
      })

    }
  }

  });
  return Message;
};