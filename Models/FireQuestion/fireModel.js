
const mongoose = require("mongoose");

const FireQuestionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  age: { type: Number, required: false },
  retireage: { type: Number, required: false },
  currentExpense: { type: Number, required: false },
  inflation: { type: Number, required: false },
  monthlysavings: { type: Number, required: false },
  retirementsavings: { type: Number, required: false },
  prereturn: { type: Number, required: false },
  postreturn: { type: Number, required: false },
  expectancy: { type: Number, required: false },
  startDate : {
    type : String,
    required : false,
  },
  base64Data:{
    type: String,
    required:false
  },
  RetirementCalculations : {
    yearsLeftForRetirement: Number,
    monthlyExpensesAfterRetirement: Number,
    totalSavingsAtRetirement: Number,
    targetedSavings: Number,
    shortfallInSavings: Number,
    accumulatedSavings: Number,
    existingSavingsGrowth: Number,
    extraOneTimeSavingsRequired: Number,
    lumpsumInvestmentNeeded:Number,
    extraMonthlySavingsRequired: Number,
    annualStepUpPercentage: Number,
    yearlyInvestment : Number,
    retirementDate : String,
  },
  AnnualStepUpDetails : {
    year: Number,
    investedAmount : Number,
    returnsRate: Number,
    totalValue: Number,
  },
  investmentAchievementPlan: {
    year: Number,
    investmentAmount: Number,
    investmentwithStepup: Number,
    InvestmentSIP:Number,
    investmentValue: Number,
    investmentvalueSIP: Number,
    investmentValuewithStepup: Number,
    ReturnsRate:Number,
    ReturnsRatewithStepup:Number,
    Return : Number,
    lumpsum : Number,
    totalvalue: Number,
    totalvaluewithStepup: Number,
    totalvalueSIP: Number,
    targetAchieve:Number,
    status: Boolean
},
withdrawPlan : {
    year : Number,
    withdrawal : Number,
    ReturnsRate:Number,
    ReturnsStepup : Number,
    ReturnSIP: Number,
    networth : Number,
    networthStepup: Number,
    networthSIP: Number,
    permonthexpenses : Number
}},
{ timestamps: true }
);
module.exports = mongoose.model("FireQuestion", FireQuestionSchema);
