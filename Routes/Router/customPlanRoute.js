const express = require("express");
const router = express.Router();
const { verifyToken } = require("../../Middleware/authMiddleware");
const customPlan = require("../../Controller/Goal-Tracker/customPlanController");

// router.post("/create",verifyToken,customPlanController.create);
// router.get("/getAll-Customplan",verifyToken,customPlanController.getAll)
// router.put("/update/:planId",verifyToken,customPlanController.Update);

router.post("/create",verifyToken,customPlan.Create);
router.get("/getAll",verifyToken,customPlan.getAll)
router.put("/update/:planId",verifyToken,customPlan.update);
router.delete("/delete/:planId",verifyToken,customPlan.delete)
module.exports = router;
