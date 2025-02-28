const mongoose = require("mongoose");

const emergencySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  monthlyExpenses: {
    type: Number,
    required: false,
  },
  monthsNeed: {
    type: Number,
    required: false,
  },
  savingsperMonth: {
    type: Number,
    required: false,
  },
  expectedFund: {
    type: Number,
    required: false,
  },
  actualFund: [
    {
      Entry: [
        {
          date: {
            type: String,
            required: true,
          },
          time: {
            type: String,
            required: true,
          },
          amount: {
            type: Number,
            required: false,
          },
          rateofInterest: {
            type: Number,
            required: false,
          },
          savingsMode: {
            type: String,
            enum: ["F.D", "R.D", "M.F liquid", "M.F debt"],
            required: false,
          },
          type: {
            type: String,
            enum: ["savings", "withdraw"],
            required: false,
          },
        },
      ],
    },
  ],
  totalAmount: {
    type: Number,
    required: false,
    default: 0,
  },
}, { timestamps: true });

module.exports = mongoose.model("EmergencyFund", emergencySchema);
