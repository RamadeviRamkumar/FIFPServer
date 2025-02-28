const express = require("express");
const router = express.Router();
const { verifyToken } = require("../../Middleware/authMiddleware");
const FireQuestion = require("../../Controller/FireQuestion/fireController");

router.post("/create", verifyToken, FireQuestion.Create);
router.get("/getall", verifyToken, FireQuestion.getAll);
router.post("/pdf", verifyToken, FireQuestion.pdfGenerate)
router.get('/getBase64Pdf', verifyToken, FireQuestion.getPdf)

module.exports = router;






