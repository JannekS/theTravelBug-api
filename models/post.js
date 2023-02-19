const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const User = require('./user');
const Location = require('./location');


const Post = sequelize.define('post', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        unique: true,
        primaryKey: true
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    dateFrom: {
        type: Sequelize.DATEONLY,
        allowNull: false,
    },
    dateTo: {
        type: Sequelize.DATEONLY,
        allowNull: false,
    },
    image: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    text: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
    tripDuration: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    authorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    locationId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    }
});

Post.belongsTo(User, { foreignKey: 'authorId', as: 'author' });
Post.belongsTo(Location, { foreignKey: 'locationId', as: 'location' });

module.exports = Post;