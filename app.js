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

// TODO: check if this is redundant with CORS, or what are the differnces/advantages
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080'); //include with env.variable
    res.setHeader(
      'Access-Control-Allow-Methods',
      'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    );
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Origin, Accept, X-Requested-With');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
  });

app.use(router);

app.get("/", function (req, res) {
    console.log("Someone requested the server root url...");
    res.send("404 - This page does not exist...");
});

// Global error handling function
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
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