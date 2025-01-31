const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const attributes = {
        name: { type: DataTypes.STRING, allowNull: false },
        description: { type: DataTypes.STRING, allowNull: true },
        price: { type: DataTypes.FLOAT, allowNull: false },
        productStatus: { type: DataTypes.ENUM('deactivated', 'active'), allowNull: false, defaultValue: 'active'}
    };

    return sequelize.define('Product', attributes);
};