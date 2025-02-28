
const mongoose = require("mongoose");
const houseplanSchema = new mongoose.Schema({
  userId: 
  { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true 
  },
  plannedYear : {
    type : Number,
    required : false,
  },
  estimatedCost : {
    type : Number,
    required : false,
  },
  purchasingMode : {
    type : Boolean,
    required : false,
  },
  inflationRate : {
    type : Number,
    required : false,
  },
  expectedReturn : {
    type : Number,
    required : false,
  },
  currentSavings : {
    type : Number,
    required : false,
  },
  downpayment : {
    type : Number,
    required : false,
  },
  loanPercentage : {
    type : Number,
    required : false,
  },
  loanTenure : {
    type : Number,
    required : false,
  },
  futureCost : {
    type : Number,
    required : false,
  },
  futureValueSavings : {
    type : Number,
    required : false,
  },
  totalValue : {
    type : Number,
    required : false,
  },
  TargetedFutureValue : {
    type : Number,
    required : false,
  },
  monthlySip : {
    type : Number,
    required : false,
  },
  investmentAmount : {
    type : Number,
    required : false,
  },
  returnsRate : {
    type : Number,
    required : false,
  },
  targetedAmount : {
    type : Number,
    required : false,
  },
  monthlyEMI : {
    type : Number,
    required : false,
  },
  principalAmount : {
    type : Number,
    required : false,
  },
  interestAmount : {
    type : Number,
    required : false,
  },
  totalAmountPayable : {
    type : Number,
    required : false,
  }
});
module.exports = mongoose.model("HousePlan", houseplanSchema);






