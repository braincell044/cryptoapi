const express = require('express');
const router = express.Router();
const _ = require('lodash');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config'); // Make sure you have the config package installed: npm install config

const auth = require('../middleware/auth');
const { getUserDetails } = require('../controllers/userController');


const { User, validateUser } = require('../model/user');


router.post('/', async (req, res) => {
    const { error } = validateUser(req.body);  // Use validateUser function
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    // Check if user already exists
    let user = await User.findOne({ email: req.body.email });
    if (user) {
        return res.status(400).send('User already registered.');
    }

    // Create new user
    user = new User(_.pick(req.body, ['name', 'email', 'password']));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    try {
        await user.save();
    } catch (err) {
        return res.status(500).send('Error creating user: ' + err.message);
    }

    // Send token and user data
    const token = jwt.sign({ _id: user._id }, config.get('jwtPrivateKey'));
    res.send({ ..._.pick(user, ['_id', 'name', 'email']), token });
});




router.get("/:name", getUserDetails);
module.exports = router;