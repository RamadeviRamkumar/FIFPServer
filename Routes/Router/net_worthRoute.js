const express = require("express");
const router = express.Router();
const { verifyToken } = require("../../Middleware/authMiddleware");
const netWorthController = require('../../Controller/Net_worth/net_worthController.js')

router.post('/create', verifyToken, netWorthController.upsert )
router.get('/getAll', verifyToken, netWorthController.getAll)
router.delete('/delete', verifyToken, netWorthController.delete)

module.exports = router;