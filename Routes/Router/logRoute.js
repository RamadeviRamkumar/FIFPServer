const express = require('express');
const router = express.Router();
const { getLatestLog, getLogByDate } = require('../../Controller/Logs/logController');

// Fetch the latest log
router.get('/latest', getLatestLog);

// Fetch logs by date
router.get('/:date', getLogByDate);

module.exports = router;
