const express = require("express");
const router = express.Router();
const { verifyToken } = require("../../Middleware/authMiddleware");
const mutualfundsController = require("../../Controller/MutualFunds/amcControler");




router.post('/store-data',mutualfundsController.create)
router.post('/store-excell-data',mutualfundsController.excelData)

router.post('/getAll-details',verifyToken,mutualfundsController.getAllDetails)
router.get('/getall/amc',verifyToken,mutualfundsController.getAllAMCList)
router.get('/getAll/category',verifyToken,mutualfundsController.getAllCategory)
router.get('/getAll/sub-category',verifyToken,mutualfundsController.getAllSubCategory)
router.get('/getperformance',verifyToken,mutualfundsController.getPerformance)



module.exports = router;
