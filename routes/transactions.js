


router.post('/deposit', authenticateToken, async (req, res) => {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid deposit amount." });
    }

    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: "User not found." });

        // Update balance
        user.balance += amount;
        await user.save();

        res.json({ message: "Deposit successful!", newBalance: user.balance });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error." });
    }
});
