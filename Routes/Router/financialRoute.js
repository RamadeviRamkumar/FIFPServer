const express = require('express');
const router = express.Router();
const {verifyToken} = require('../../Middleware/authMiddleware');
const Financial = require("../../Controller/FinancialHealth/financialController");


router.post('/create',verifyToken,Financial.upsert);

router.get('/analyze',verifyToken,Financial.getUserFinancial);
router.get('/getAll',verifyToken, Financial.getAll)

module.exports = router;
