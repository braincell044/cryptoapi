const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({ walletAddress: "17K8yXFer49JCRQAUV1iyB1q2QBFn73GM" });
});

module.exports = router;
