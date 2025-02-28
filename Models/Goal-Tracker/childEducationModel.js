
const mongoose = require('mongoose');

const childEducaitonSchema = new mongoose.Schema({
    userId:{
        type:String,
    },
    firstchild:[{
        childname:{type:String},
        currentage:{type:Number},
        study_duration:{type:Number},
        education_estimateamount:{type:Number},
        firstchild_current_savings :{type:Number}
    }],
    secondchild:[{
        childname:{type:String},
        currentage:{type:Number},
        study_duration:{type:Number},
        education_estimateamount:{type:Number},
        secondchild_current_savings :{type:Number}
    }],
    inflationrate:{
        type:Number,
    },
    returnrate:{
        type:Number,
    },
    firstchildwith_inflationamount:{
        type:Number
    },
    secondchilddwith_inflationamount:{
        type:Number
    },
    current_savings :{
         type:Number
    },
    firstchild_current_savings :{
        type:Number
    },
    secondchild_current_savings :{
        type:Number
    },
    firstchild_totalFutureCost :{
        type:Number
    },
    secondchild_totalFutureCost :{
        type:Number
    },
    firstchild_savingsInterest :{
        type:Number
    },
    secondchild_savingsInterest :{
        type:Number
    },
    firstchild_monthlysiP :{
        type:Number
    },
    secondchild_monthlysip :{
        type:Number
    },
    firstchild_existingSavings :{
        type:Number
    },
    secondchild_existingSavings :{
        type:Number
    }
},{ timestamps: true })
const result = new mongoose.model('childEducation', childEducaitonSchema)
module.exports = result