const mongoose = require('mongoose');

const emergencyFundPlanSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    monthlyExpense:{
      type:Number,
    },
    expenseTotalMonth:{
        type:Number,
    },
    totalExpenses:{
        type:Number,
    },
    savingPeriodOfMonth:{
        type:Number,
    },
    returnRate:{
        type:Number,
    },
    monthlySipAmount:{
        type:Number
    },
    investedAmount:{
        type:Number,
    },
    estimatedReturn:{
        type:Number,
    },

}, { timestamps: true })

const result = new mongoose.model('emergencyFundPlan', emergencyFundPlanSchema)

module.exports = result