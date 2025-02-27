import express from 'express';
import _ from 'lodash';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, validateUser } from '../model/user.js';

import { getUserDetails } from '../controllers/userController.js';

const router = express.Router();

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

    const payload = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.isAdmin ? 'admin' : 'user'  // Ensure this logic works
        
    };
   


    const token = jwt.sign(payload, process.env.JWT_SECRET , { expiresIn: '1h' });
    

    
        
    res.send({ ..._.pick(user, ['_id', 'name', 'email']), token });
});

router.get('/:name', getUserDetails);


export default router;
