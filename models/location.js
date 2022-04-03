const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Location = sequelize.define('location', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        unique: true,
        primaryKey: true
    },
    city: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    country: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    lat: {
        type: Sequelize.FLOAT,
        allowNull: false,
    },
    lng: {
        type: Sequelize.FLOAT,
        allowNull: false,
    },
});

module.exports = Location;