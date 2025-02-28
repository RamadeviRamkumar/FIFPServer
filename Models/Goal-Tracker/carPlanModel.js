const mongoose = require('mongoose');

const carBuyingPlanSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    carModel: {
        type: String,
    },
    estimatedPrice: {
        type: Number,
    },
    periodOfYear:{
        type:Number,
    },
    purchasingMode: {
        type: Boolean,
    },
    percentageOfDownPayment: {
        type: Number,
    },
    percentageOfInterest: {
        type: Number,
    },
    inflationRate: {
        type: Number,
    },
    espectedReturnRate: {
        type: Number,
    },
    totalCIAmount:{
        type:Number,
    },
    monthlySipAmount:{
        type:Number
    },
    emiAmount:{
        type:Number,
    },
    investedAmount:{
        type:Number,
    },
    estimatedReturn:{
        type:Number,
    },
    principalAmount:{
        type:Number,
    },
    interestAmount:{
        type:Number,
    },
    totalAmountPayable:{
        type:Number
    }
}, { timestamps: true })


const result = new mongoose.model('CarPlanner', carBuyingPlanSchema)


module.exports = result