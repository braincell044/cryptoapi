import express from 'express';
import { Deposit } from '../model/deposit.js';
import { User } from '../model/user.js';
import { authenticateToken, authenticateAdmin } from '../middleware/auth.js';
// import { sendEmail } from '../utils/email.js';

const router = express.Router();

// User creates a deposit request
router.post('/deposit', authenticateToken, async (req, res) => {
    const { amount, plan } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ message: "Invalid deposit amount." });

    try {
        const deposit = new Deposit({ user: req.user._id, amount, plan });
        await deposit.save();

        const user = await User.findById(req.user._id);
        // await sendEmail(user.email, 'Deposit Submitted', 'Your deposit is pending approval.');

        res.json({ message: "Deposit request submitted. Awaiting admin approval." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error." });
    }
});

// Admin gets all pending deposits
router.get('/admin/deposits', authenticateToken, authenticateAdmin, async (req, res) => {
    try {
        const deposits = await Deposit.find({ status: 'pending' }).populate('user', 'username email');
        res.json(deposits);
    } catch (error) {
        res.status(500).json({ message: "Server error." });
    }
});

// Admin approves a deposit
router.post('/admin/deposits/:id/approve', authenticateToken, authenticateAdmin, async (req, res) => {
    try {
        const deposit = await Deposit.findById(req.params.id);
        if (!deposit) return res.status(404).json({ message: "Deposit not found." });

        deposit.status = 'approved';
        await deposit.save();

        const user = await User.findById(deposit.user);
        user.balance += deposit.amount;
        await user.save();

        // await sendEmail(user.email, 'Deposit Approved', 'Your deposit has been approved and added to your balance.');

        res.json({ message: "Deposit approved successfully." });
    } catch (error) {
        res.status(500).json({ message: "Server error." });
    }
});

// Admin rejects a deposit
router.post('/admin/deposits/:id/reject', authenticateToken, authenticateAdmin, async (req, res) => {
    try {
        const deposit = await Deposit.findById(req.params.id);
        if (!deposit) return res.status(404).json({ message: "Deposit not found." });

        deposit.status = 'rejected';
        await deposit.save();

        const user = await User.findById(deposit.user);
        // await sendEmail(user.email, 'Deposit Rejected', 'Your deposit has been rejected.');

        res.json({ message: "Deposit rejected successfully." });
    } catch (error) {
        res.status(500).json({ message: "Server error." });
    }
});

export default router;
