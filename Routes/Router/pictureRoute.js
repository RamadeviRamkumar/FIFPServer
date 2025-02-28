const express = require("express");
const router = express.Router();
const { verifyToken } = require("../../Middleware/authMiddleware");
const ProfilePicture = require ("../../Controller/Login/pictureController");
const {upload} = require('../../Controller/Login/pictureController')

router.post("/profilePic",verifyToken, upload.single('image'), ProfilePicture.upsert);
router.get('/getAll',verifyToken, ProfilePicture.getByuserId)

module.exports = router;