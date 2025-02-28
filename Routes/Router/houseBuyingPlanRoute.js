const express = require("express");
const router = express.Router();
const HousePlan = require('../../Controller/Goal-Tracker/houseBuyingPlanController')
const { verifyToken } = require("../../Middleware/authMiddleware");

router.post("/create",verifyToken,HousePlan.Create);
router.get('/getAll',verifyToken,HousePlan.getAll);
router.get("/getById/:vehicleId",verifyToken,HousePlan.getById);
router.put('/update/:houseId',verifyToken,HousePlan.update);
router.delete("/delete/:houseId",verifyToken,HousePlan.deleteById);

// router.post("/create",HousePlan.Create);
// router.get('/getAll',HousePlan.getAll);
// router.get('/getById/:houseId',HousePlan.getById);
// router.put('/update/:houseId',HousePlan.update);
// router.delete("/delete/:houseId",HousePlan.deleteById);

module.exports = router;