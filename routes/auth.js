const express = require('express');
const router = express.Router();
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../model/user');
const authenticateToken = require("../middleware/auth");

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(400).json({ message: 'Invalid email or password.' });

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) return res.status(400).json({ message: 'Invalid email or password.' });

        const jwtPrivateKey = process.env.JWT_SECRET;
        if (!jwtPrivateKey) {
            return res.status(500).json({ message: "JWT secret is missing from environment variables." });
        }

        const token = jwt.sign({ _id: user._id }, jwtPrivateKey, { expiresIn: '1h' });

        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get("/profile", authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server error" });
    }
});

router.post('/deposit', authenticateToken, async (req, res) => {
    const { amount, plan } = req.body;

    if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid deposit amount." });
    }

    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: "User not found." });

        user.balance += amount;
        await user.save();

        res.json({ message: "Deposit successful!", newBalance: user.balance, plan });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error." });
    }
});

function validate(req) {
    const schema = Joi.object({
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    });

    return schema.validate(req);
}

module.exports = router;
