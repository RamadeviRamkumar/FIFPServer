const express = require("express");
const router = express.Router();
const DebtClearance = require("../../Controller/Debt-Clearance/debtController");
const { verifyToken } = require("../../Middleware/authMiddleware");

// router.post("/create", verifyToken, DebtClearance.createDebt);
// router.get("/all", verifyToken, DebtClearance.getAllDebts);
// router.post("/payemi", verifyToken, DebtClearance.payEMI);

router.post("/create",  DebtClearance.createDebt);
router.get("/all", DebtClearance.getAllDebts);
router.get("/snowball",DebtClearance.getSnowball);
router.post("/payemi", DebtClearance.payEMI);

module.exports = router;
