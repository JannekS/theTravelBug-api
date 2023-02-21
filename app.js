require('dotenv').config();

const express = require("express");
const path = require("path");
const cors = require("cors");
const multer = require('multer');

const sequelize = require('./util/database');

const router = require('./router');

const app = express();
const port = process.env.PORT || 3000;

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/img/locations');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // TODO: make filename unique by concat with hash
  },
});

// only allow image files
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
    cb(null, true)
  } else {
    cb(null, false)
  }
};

//middlewares
app.use(cors());
app.use(express.urlencoded({ extended: true })); // TODO: Check if I really need this or bodyparser ??
app.use(multer({ storage: fileStorage, fileFilter }).single('image'));
app.use(express.json());    // TODO: Check if I really need this
app.use(express.static(path.join(__dirname, "public")));

// TODO: check if this is redundant with CORS, or what are the differnces/advantages
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080'); //include with env.variable not needed
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