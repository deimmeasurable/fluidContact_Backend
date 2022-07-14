'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Contact}) {
      // define association here
      this.hasMany(Contact, {foreignKey:'userId', as: 'contact'})
    }

    toJSON(){
      return { ...this.get(), undefined }
    }
  }
  User.init({
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate:{
        notNull:{ msg: 'Username can not be blank' },
        notEmpty: {msg:'Username must not be empty'},
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate:{
        notNull:{ msg: 'Email can not be blank' },
        notEmpty: {msg:'Email must not be empty'},
        isEmail: { msg: 'Must be a valid email address' }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate:{
        notNull:{ msg: 'Password can not be blank' },
        notEmpty: {msg: 'Password muct not be empty'}
      }
    },
  }, {
    sequelize,
    tableName: 'user',
    modelName: 'User',
  });
  return User;
};