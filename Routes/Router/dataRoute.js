const express = require('express');
const ExcelData = require('../../Controller/Excel-Sheet/dataController');
const router = express.Router();

router.post('/upload', ExcelData.uploadExcel);
router.get('/all', ExcelData.getAllData);

module.exports = router;
