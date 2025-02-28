const express = require("express");
const router = express.Router();
const automationController = require("../../Controller/Automation/automationController");
const cron = require('node-cron');

router.post('/getall-mfperformance-data',automationController.getAll)

module.exports = router;

cron.schedule('45 7 * * 1-5', () => {
   
    console.log("Running cron job Started...");
    automationController.getAll();  
});
