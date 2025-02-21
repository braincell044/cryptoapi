const express = require('express');
const router = express.Router();
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, validateUser } = require('../model/user');
const auth = require('../middleware/auth');
const { getUserDetails } = require('../controllers/userController');

router.post('/', async (req, res) => {
    const { error } = validateUser(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    let user = await User.findOne({ email: req.body.email });
    if (user) {
        return res.status(400).send('User already registered.');
    }

    user = new User(_.pick(req.body, ['name', 'email', 'password']));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    try {
        await user.save();
    } catch (err) {
        return res.status(500).send('Error creating user: ' + err.message);
    }

    const jwtPrivateKey = process.env.JWT_SECRET;
    if (!jwtPrivateKey) {
        return res.status(500).json({ message: "JWT secret is missing from environment variables." });
    }

    const token = jwt.sign({ _id: user._id }, jwtPrivateKey);
    res.send({ ..._.pick(user, ['_id', 'name', 'email']), token });
});

router.get("/:name", getUserDetails);

module.exports = router;
