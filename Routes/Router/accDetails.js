const express = require('express')
const router = express.Router()
const {verifyToken} = require('../../Middleware/authMiddleware');
const accDetails = require('../../Controller/UserAccDetails/userAccdetails')

router.get('/getAll', verifyToken, accDetails.getAllUserAccountDetails)

module.exports = router;