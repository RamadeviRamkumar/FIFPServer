const mongoose = require("mongoose");

const customPlanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  planName: {
    type: String,
    required : false,
  },
  estimatedCost : {
    type : Number,
    required : false,
  },
  plannedYear: {
    type: Number,
    required : false,
  },
  inflationRate: {
    type: Number,
    required : false,
  },
  expectedReturn: {
    type: Number,
  },
  currentSavings: {
    type: Number,
    required : false,
  },
  futureCost: {
    type: Number,
    required: false,
  },
  futureValueSavings: {
    type: Number,
    required: false,
  },
  TargetedFutureValue: {
    type: Number,
    required: false,
  },
  monthlySip: {
    type: Number,
    required: false,
  },
  investmentAmount: {
    type: Number,
    required: false,
  },
  returnsRate: {
    type: Number,
    required: false,
  },
  targetedAmount: {
    type: Number,
    required: false,
  },
});

const result = new mongoose.model("customPlan", customPlanSchema);

module.exports = result;
