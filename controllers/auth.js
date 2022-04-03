const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

async function signup(req, res, next) {
    const hashedPassword = await bcrypt.hash(req.body.password, 12)
    const name = req.body.name;
    const email = req.body.email;

    try {
        const newUser = await User.create({
        name: name,
        email: email,
        password: hashedPassword
        });
        return res.json({message: "You successfully signed up!", userId: newUser._id, userName: newUser.name});
    }
    catch(err) {        // TODO: elaborate on this
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
    
};

async function login(req, res, next) {
    const email = req.body.email;
    const password = req.body.password;
    try {
        const userDoc = await User.findOne({ where: { email: email } });
        let pwCorrect = false;
        if (!userDoc) {
            const error = new Error();
            error.statusCode = 401;
            throw error;
        }
        pwCorrect = await bcrypt.compare(password, userDoc.password);
        if (!pwCorrect) {
            const error = new Error();
            error.statusCode = 401;
            throw error;
        }
        const token = jwt.sign(
            {
                userName: userDoc.name,
                userId: userDoc.id.toString()
            },
            process.env.TOKEN_SECRET,
            { expiresIn: '1h' }
        );
        return res.status(200)
            .json({ token: token, userName: userDoc.name, userId: userDoc.id.toString(), message: 'Logged in sucessfully!' });
    }
    catch (err) {
        if (err.statusCode === 401) {
            err.message = "Your email or password are incorrect. Please check the spelling.";
        }
        next(err);
    }
};

module.exports = { signup, login };