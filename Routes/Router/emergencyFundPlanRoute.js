const express = require("express");
const router = express.Router();
const { verifyToken } = require("../../Middleware/authMiddleware");
const EmergencyFund = require("../../Controller/Goal-Tracker/emergencyFundPlanController");

router.post("/create",verifyToken,EmergencyFund.createPlan);
router.get('/getallemergencyplan',verifyToken,EmergencyFund.getAll)


module.exports = router;
