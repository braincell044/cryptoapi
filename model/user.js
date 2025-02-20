const Joi = require('joi');
const mongoose = require('mongoose');

// User model
const User = mongoose.model('User', new mongoose.Schema({
    name: { type: String, required: true, minlength: 3, maxlength: 50 },
    email: { type: String, required: true, minlength: 5, maxlength: 255, unique: true },
    password: { type: String, required: true, minlength: 5, maxlength: 1024 },
    balance: { type: Number, default: 0 },
    isAdmin: { type: Boolean, default: false },
    signupDate: { type: Date, default: Date.now },
}));

// User validation
function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(1024).required(),
        balance: { type: Number, default: 0 },
        isAdmin: { type: Boolean, default: false },
        signupDate: { type: Date, default: Date.now },
    });
    return schema.validate(user);
}

// Export both User and validateUser
module.exports = { User, validateUser };
