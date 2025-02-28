const express = require('express');
const router = express.Router();
const {verifyToken} = require('../../Middleware/authMiddleware');
const PersonalRisk = require("../../Controller/PersonalRiskTolerance/riskController");

router.post('/create',verifyToken, PersonalRisk.createRiskProfile);
router.get('/getAll',verifyToken, PersonalRisk.getAllRisk);

// router.post('/create',PersonalRisk.createRiskProfile);
// router.get('/getAll',PersonalRisk.getAllRisk);

module.exports = router;
