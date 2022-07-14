'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Contact extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({User}) {
      // define association here
      this.belongsTo(User, {foreignKey: 'userId', as: "user"})
    }

    toJSON(){
      return { ...this.get(), id: this.getDataValue("id")  }
    }
  }
  Contact.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate:{
        notNull:{ msg: 'Name can not be blank' },
        notEmpty: {msg:'Name must not be empty'}
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate:{
        notNull:{ msg: 'Email can not be blank' },
        notEmpty: {msg:'Email must not be empty'}
      }
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      validate:{
        notNull:{ msg: 'Phone number can not be blank' },
        notEmpty: {msg:'Phone number must not be empty'}
      }
    },
    userId:{
      type: DataTypes.INTEGER,
      allowNull: false
    },
    }, {
      sequelize,
      tableName: 'contacts',
      modelName: 'Contact',
    });
    return Contact;
};