const mongoose = require('mongoose');

const excelDataSchema = new mongoose.Schema({
    AMC: {
        type: Number,
        index: true, 
    },
    schemeCode: {
        type: Number,
        index: true, 
    },
    schemeName: {
        type: String,
    },
    schemeType:{
        type:String,
    },
    schemeCategory: {
        type: Number,
        index: true, 
    },
    sub_Category: {
        type: Number,
        index: true, 
    },
    schemeMinimumAmount: {
        type: String,
    },
    launchDate: {
        type: String,
    },
    closureDate: {
        type: String,
    },
    ISIN_divPayout: {
        type: String,
    },
});


excelDataSchema.index({ AMC: 1, schemeCode: 1 });


excelDataSchema.index({ schemeCategory: 1, sub_Category: 1 });

const result = mongoose.model('amcExceldata', excelDataSchema);

module.exports = result;
