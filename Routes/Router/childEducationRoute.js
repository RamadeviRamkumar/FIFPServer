const express = require("express");
const router = express.Router();
const { verifyToken } = require("../../Middleware/authMiddleware");
const childEducation = require('../../Controller/Goal-Tracker/childEducationController')

router.post("/expenses", verifyToken, childEducation.createExpense);
router.get("/getalleducationplan",verifyToken, childEducation.getAllEducationPlan);
router.post("/childfPdf", verifyToken, childEducation.createPdf)
router.get("/getChildPdf", verifyToken, childEducation.getPdf)

module.exports = router;
