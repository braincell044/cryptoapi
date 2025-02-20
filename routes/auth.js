const express = require('express');
const router = express.Router();
const Joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');
const { User } = require('../model/user');

const authenticateToken = require("../middleware/auth");

// User login route
router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    try {
        // Check if user exists
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(400).json({ message: 'Invalid email or password.' });

        // Validate password
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) return res.status(400).json({ message: 'Invalid email or password.' });

        // Generate JWT Token
        if (!config.get('jwtPrivateKey')) {
            return res.status(500).json({ message: 'JWT Private Key is not defined. Check your config.' });
        }
        
        const token = jwt.sign({ _id: user._id }, config.get('jwtPrivateKey'), { expiresIn: '1h' });

        // Send token
        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get user profile route
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

        // Simulate deposit (you may want to store transactions separately)
        user.balance += amount;
        await user.save();

        res.json({ message: "Deposit successful!", newBalance: user.balance, plan });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error." });
    }
});


// Validate request data
function validate(req) {
    const schema = Joi.object({
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    });

    return schema.validate(req);
}

module.exports = router;
