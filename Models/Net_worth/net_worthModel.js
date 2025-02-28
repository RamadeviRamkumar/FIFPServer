const mongoose = require('mongoose')

const netWorthSchema = new mongoose.Schema({
    userId:{
        type:String,
        required : true
    },
    asserts:[{
        key:{
            type : String,
            required : false
        },
        value : {
                type : String,
                required : false
        }
    }],
    totalAsserts : {
        type : String
    },
    liabilities :[{
        key:{
            type : String,
            required : false
        },
        value : {
                type : String,
                required : false
        }
    }],
    totalLiabilities  : {
        type : String
    },
    netWorth : {
        type : String
    }
},
{timestamps:true})

const result = new mongoose.model('net_worth', netWorthSchema)
module.exports = result