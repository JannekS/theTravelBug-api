const express = require("express");

const postController = require("./controllers/postController");
const authControler = require('./controllers/auth');
const isAuth = require('./middleware/is-auth.js');
const validator = require('./middleware/validators.js');

const router = express.Router();

router.use(express.urlencoded({ extended: true }));

// TODO: write the right business logic for this route
router.get("/new-post", isAuth, (req, res, next) => {
    res.json({ message: "You are now authenticated...", userId: req.userId });
});

router.post("/new-post", isAuth, postController.createPost); // TODO: Add validation here!!!

router.put("/signup", validator.validateSignup, validator.errorHandler, authControler.signup);
router.post("/login", validator.validateLogin, validator.errorHandler, authControler.login);

router.get("/posts", postController.servePreviews);
router.get("/post/:id", postController.servePost);

module.exports = router;