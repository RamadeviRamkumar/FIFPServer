const mongoose = require("mongoose");

const riskSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    answers: [
      {
        question: { type: Number, required: false },
        answer: { type: String, required: false },
        points: { type: Number, required: false },
      },
    ],
    totalScore: {
      type: Number,
      required: false,
    },
    riskProfile: {
      type: String,
      required: false,
    },
    preReturn: {
      type: String,
      required: false,
    },
  
    riskBasedAssetAllocation: [
      {
        bonds: {
            government: { type: String },
            corporate: { type: String }
          },
        equities: {
            flexicap_Multicap :  { type: String },
            largeCap_Midcap : {
              largeCap :{ type: String },
              midcap : { type: String },
            },
            smallCap : { type: String },
            internationalIndexFund : { type: String },
            sectorSpecificFund : { type: String },
          },
        cash : {
          moneyMarket :  { type: String },
          shortTermFunds :  { type: String }
        },
        commodity : {
          goldSilver :{ type: String }
        },
        assetAllocation: 
          {
            bondsDebtInstruments: { type: String },
            equitiesStocks: { type: String },
            cashCashEquivalents: { type: String },
            realEstate: { type: String },
            gold: { type: String },
          },
        
      }
    ]
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("PersonalRisk", riskSchema);
