const express = require("express");
const router = express.Router();
const { verifyToken } = require("../../Middleware/authMiddleware");
const CarPlanner = require("../../Controller/Goal-Tracker/carPlanController");

router.post("/create", verifyToken,CarPlanner.createPlan);
router.get("/all", verifyToken,CarPlanner.getAll);

module.exports = router;
