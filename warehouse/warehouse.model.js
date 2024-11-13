const { DataTypes } = require('sequelize');
    
    module.exports = (sequelize, DataTypes) => {
        return sequelize.define('Warehouse', {
            productId: {
                type: DataTypes.STRING,
                allowNull: false,
                primaryKey: true
            },
            quantity: {
                type: DataTypes.INTEGER,
                allowNull: false
            }
        }, {
            timestamps: false
        });
    };
    