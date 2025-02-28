const express = require("express");
const router = express.Router();
const Vehicle = require('../../Controller/Goal-Tracker/vehicleController')
const { verifyToken } = require("../../Middleware/authMiddleware");

// router.post("/create",verifyToken,Vehicle.Create);
// router.get('/getAll',verifyToken,Vehicle.getAll);
// router.get("/getById/:vehicleId",verifyToken,Vehicle.getById);
// router.put('/update/:vehicleId',verifyToken,Vehicle.update);
// router.delete("/delete/:vehicleId",verifyToken,Vehicle.deleteById);

router.post("/create",Vehicle.Create);
router.get('/getAll',Vehicle.getAll);
router.get("/getById/:vehicleId",Vehicle.getById);
router.put('/update/:vehicleId',Vehicle.update);
router.delete("/delete/:vehicleId",Vehicle.deleteById);

module.exports = router; 