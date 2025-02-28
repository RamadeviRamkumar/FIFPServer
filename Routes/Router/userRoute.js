const express = require("express");
const router = express.Router();
const { verifyToken } = require("../../Middleware/authMiddleware");
const Profile = require("../../Controller/Login/userController");

router.post("/create",verifyToken,Profile.create);
router.get("/getById/:profileId",verifyToken,Profile.getById);
router.delete("/delete/:profileId",verifyToken,Profile.deleteById);
router.get("/getAll",verifyToken,Profile.getAll);
router.put("/update/:profileId",verifyToken,Profile.update);

module.exports = router;
