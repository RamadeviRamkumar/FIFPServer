const express = require("express");
const router = express.Router();
const { verifyToken } = require("../../Middleware/authMiddleware");
const amfiData = require("../../Controller/Amfi/amfidataController");


router.get('/get/:scheme',amfiData.getbyScheme)
router.get('/get/:scheme/latestdata',amfiData.getbySchemeLatestData)
router.get('/getnavbyschemecode',amfiData.getNavBySchemeCode)
// router.get('/getallemergencyplan',verifyToken,EmergencyFund.getAll)


module.exports = router;
