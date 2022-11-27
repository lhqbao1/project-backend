'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Foss extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here (moi lien he)
        }
    }
    Foss.init({
        name: DataTypes.STRING,
        comment: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'Foss',
    });
    return Foss;
};