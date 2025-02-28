const express = require('express');
const router = express.Router();
const { verifyToken } = require("../../Middleware/authMiddleware");

const userData = require("../../Controller/Admin/admin");

router.get('/users',verifyToken, userData.getUserData);
router.get('/getAll',verifyToken, userData.getAllUser)

module.exports = router;
