const emergencyService = require("../../Service/EmergencyFund/emergencyService");
const regex = require('../../Regex/regex');
// const logger = require('../../utils/logger')

// exports.upsert = (req, res) => {
//   //#swagger.tags=['Emergency-Fund']
//   const {
//     userId,
//     monthlyExpenses,
//     monthsNeed,
//     savingsperMonth,
//     initialEntry,
//     emergencyId,
//   } = req.body;

//   if(!userId){
//     return res.status(200).json({ message: "UserId Not Found" });
//   }

//   if ((!monthlyExpenses)) {
//     return res.status(200).json({ message: "Monthly Expense fields are required" });
//   }else if(monthlyExpenses && !regex.onlyNumber.test(monthlyExpenses)){
//     return res.status(200).json({ message: "Monthly Expense Numbers Only Allowed"}) ;
//   }
//   if(!monthsNeed){
//     return res.status(200).json({ message: "Month fields are required" });
//   }else if (monthsNeed && !regex.month.test(monthsNeed)){
//     return res.status(200).json({ message: "0 to 12 Monthe before only Allowed"}) ;
//   }

//   if(!savingsperMonth){
//     return res.status(200).json({ message: "Save Per Month fields are required" });
//   }else if(savingsperMonth && !regex.onlyNumber.test(savingsperMonth)){
//     return res.status(200).json({ message: "Saving Numbers Only Allowed" });
//   }
//   const emergency = {
//     userId,
//     monthlyExpenses,
//     monthsNeed,
//     savingsperMonth,
//     initialEntry,
//     emergencyId,
//   };
//   if(initialEntry){
//     const { amount, type, savingsMode } = initialEntry;
//     if(!amount){
//       return res.status(200).json({
//         message: "Amount fields are required",
//       });
//     }else if(amount && !regex.onlyNumber.test(amount)){
//       return res.status(200).json({
//         message: "Invalid Amount: Only Numbers are Allowed",
//       });
//     }

//     if (!["savings", "withdraw"].includes(type)) {
//       return res.status(200).json({ message: "Type must be either 'savings' or 'withdraw'" });
//     }
//   }
//   emergencyService
//     .upsert(emergency)
//     .then((response) => {
//       res.status(201).json(response);
//     })
//     .catch((error) => {
//       console.log(error);
//       res.status(500).json({ error: "Internal server error" });
//     });
// };


exports.upsert = (req, res) => {
  //#swagger.tags=['Emergency-Fund']
  const {
    userId,
    monthlyExpenses,
    monthsNeed,
    savingsperMonth,
    initialEntry,
    emergencyId,
  } = req.body;

  // Validation for required fields
  if (!userId) {
    return res.status(200).json({ message: "UserId Not Found" });
  }

  if (!monthlyExpenses) {
    return res.status(200).json({ message: "Monthly Expense fields are required" });
  } else if (monthlyExpenses && !regex.onlyNumber.test(monthlyExpenses)) {
    return res.status(200).json({ message: "Monthly Expense Numbers Only Allowed" });
  }

  if (!monthsNeed) {
    return res.status(200).json({ message: "Month fields are required" });
  } else if (monthsNeed && !regex.month.test(monthsNeed)) {
    return res.status(200).json({ message: "0 to 12 Months only Allowed" });
  }

  if (!savingsperMonth) {
    return res.status(200).json({ message: "Save Per Month fields are required" });
  } else if (savingsperMonth && !regex.onlyNumber.test(savingsperMonth)) {
    return res.status(200).json({ message: "Saving Numbers Only Allowed" });
  }

  // Validation for initialEntry fields
  if (initialEntry) {
    const { amount, type, rateofInterest, savingsMode } = initialEntry;

    if (!amount) {
      return res.status(200).json({ message: "Amount is required" });
    } else if (amount && !regex.onlyNumber.test(amount)) {
      return res.status(200).json({
        message: "Invalid Amount: Only Numbers are Allowed",
      });
    }

    if (!type) {
      return res.status(200).json({ message: "Type is required" });
    }

    if (!["savings", "withdraw"].includes(type)) {
      return res.status(200).json({ message: "Type must be either 'savings' or 'withdraw'" });
    }

    // Additional validation for "savings" type
    if (type === "savings") {
      if (rateofInterest === undefined || rateofInterest === null) {
        return res.status(200).json({ message: "Rate of Interest is required for savings type" });
      }

      if (typeof rateofInterest !== "number" || rateofInterest < 0) {
        return res.status(200).json({ message: "Valid Rate of Interest is required for savings type" });
      }

      if (!savingsMode) {
        return res.status(200).json({ message: "Savings Mode is required for savings type" });
      }

      if (!["F.D", "R.D", "M.F liquid", "M.F debt"].includes(savingsMode)) {
        return res.status(200).json({ message: "Invalid Savings Mode" });
      }
    }
  }

  const emergency = {
    userId,
    monthlyExpenses,
    monthsNeed,
    savingsperMonth,
    initialEntry,
    emergencyId,
  };

  emergencyService
    .upsert(emergency)
    .then((response) => {
      logger.info(`${userId} - Emergency Fund Updated Sucessfully`)
      res.status(201).json(response);
    })
    .catch((error) => {
      logger.error(`${userId} - Emergency Fund Updated Api Internal Server Error`)
      console.log(error);
      res.status(500).json({ error: "Internal server error" });
    });
};


exports.getAll = (req, res) => {
  //#swagger.tags=['Emergency-Fund']
  const { userId } = req.query;
  if (!userId) {
    return res.status(200).json({ error: "userId is required" });
  }
  emergencyService
    .getAll(userId)
    .then((response) => {
      logger.info(`${userId} - Expenses Fetched Sucessfully `)
      res.status(201).json(response);
    })
    .catch((error) => {
      if (error.statusCode === "1" && error.message === "No Expenses found for the provided userId") {
        logger.error(`${userId} - Expenses Plan Get Api Internal Server Error`)
        return res.status(200).json({
          message: error.message,
        });
      }
      console.log(error);
      res.status(500).json({ error: "Internal Server error" });
    });
};

exports.getById = (req, res) => {
  //#swagger.tags=['Emergency-Fund']
  const { emergencyId } = req.params;
  if (!emergencyId) {
    return res.status(200).json({ message: "emergencyId is required" });
  }
  emergencyService
    .getById(emergencyId)
    .then((response) => {
      res.status(201).json(response);
    })
    .catch((error) => {
      if (error.statusCode === "1" && error.message === "Data Not Found") {
        return res.status(200).json({
          statusCode: error.statusCode,
          message: error.message
        })
      }
      console.log(error);
      res.status(500).json(error);
    });
};

exports.deleteById = (req, res) => {
  //#swagger.tags=['Emergency-Fund']
  const { emergencyId } = req.params;
  if (!emergencyId) {
    return res.status(200).json({ error: "emergencyId is required" });
  }
  emergencyService
    .deleteById(emergencyId)
    .then((response) => {
      res.status(201).json(response);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json(error);
    });
};
