import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../model/user.js';
import { authenticateToken, authenticateAdmin  } from '../middleware/auth.js';

const router = express.Router();

// Admin Login Route
router.post('/admin/login', async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const admin = await User.findOne({ email });
        if (!admin || !admin.isAdmin) {
            return res.status(403).json({ message: "Access denied. Not an admin." });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials." });
        }

        // Generate Token
        const token = jwt.sign({ _id: admin._id, isAdmin: true }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ token, message: "Login successful" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error." });
    }
});

// Get Admin Profile
router.get('/admin/profile', authenticateToken, authenticateAdmin, async (req, res) => {
    try {
        const admin = await User.findById(req.user._id).select('-password');
        res.json(admin);
    } catch (error) {
        res.status(500).json({ message: "Server error." });
    }
});
router.post('/api/auth', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, isAdmin: user.isAdmin }); // Ensure isAdmin is sent
});

export default router;
