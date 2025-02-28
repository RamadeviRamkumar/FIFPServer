const express = require("express");
const router = express.Router();
const { verifyToken } = require("../../Middleware/authMiddleware");
const peersController = require('../../Controller/peers/peersController')

router.get("/comparision",verifyToken,peersController.getDetails);


module.exports = router;
