require('dotenv').config();

const express = require("express");
const path = require("path");
const cors = require("cors");

const sequelize = require('./util/database');

const router = require('./router');

const app = express();
const port = process.env.PORT || 3000;

//middlewares
app.use(cors());
app.use(express.urlencoded({extended: true})); // TODO: Check if I really need this
app.use(express.json());    // TODO: Check if I really need this
app.use(express.static(path.join(__dirname, "public")));

app.use(router);

app.get("/", function (req, res) {
    console.log("Someone requested the server root url...");
    res.send("404 - This page does not exist...");
});

sequelize
    .sync(/* { force: true } */) // overwrite the database on start
    .then(result => {
        app.listen(port, function() {
            console.log(`The express server is running on port ${port}`);
        });
    }).catch(err => {
        console.log(err);
    });