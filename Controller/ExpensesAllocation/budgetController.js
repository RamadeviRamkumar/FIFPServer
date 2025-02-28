const budgetService = require("../../Service/ExpensesAllocation/budgetService");
const regex = require('../../Regex/regex');
// const logger = require('../../utils/logger')

exports.create = (req, res) => {
  //#swagger.tags = ['Budgetplan-income']
  const { month, year, income, otherIncome , userId } = req.body;

  if (!month || !year || !income || !userId) {
    const missingParams = []
    if(!month)missingParams.push("Month");
    if(!year)missingParams.push("Year");
    if(!income)missingParams.push("Income");
    if(!userId)missingParams.push("UserID");
    return res.status(200).json({
      message: `${missingParams.join(',')} fields are required`,
    });
  }

  if(month && !regex.onlyString.test(month)){
    return res.status(200).json({
      success: false,
      message: "Invalid Month: Letters only allowed",
    });
  }
  if(year && !regex.onlyNumber.test(year)){
    return res.status(200).json({
      success: false,
      message: "Invalid Year: Numbers only allowed",
    });
  }
  if(income && !regex.onlyNumber.test(income)){
    return res.status(200).json({
      success: false,
      message: "Invalid Income: Numbers only allowed",
    });
  }
  // if(otherIncome && !regex.arrayNumber.test(otherIncome)){
  //   return res.status(200).json({
  //     success: false,
  //     message: "Invalid OtherIncome: Numbers only allowed",
  //   });
  // }

  let processedOtherIncome = null
  if (otherIncome) {
    if (!Array.isArray(otherIncome)) {
      return res.status(200).json({
        success: false,
        message: "'otherIncome' should be an array",
      });
    }
    processedOtherIncome = otherIncome
  }


  const budget = { month, year, income, otherIncome: processedOtherIncome, userId };

  budgetService
    .create(budget)
    .then((response) => {
      logger.info(`${userId}- Budget Plan Income Created Successfully`)
      res.status(201).json({
        success: true,
        message: "Budget-plan income created successfully",
        budget: response,
      });
    })
    .catch((error) => {
      logger.error(`${userId} - Budget Plan Income Create APi Internal Server Error`)
      console.error("Error creating budget:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create budget",
        error: error.message,
      });
    });
};

// exports.create = (req, res) => {
//   //#swagger.tags = ['Budgetplan-income']
//   const { month, year, income, otherIncome = [], userId } = req.body;

//   if (!month || !year || !income || !userId) {
//     return res.status(200).json({
//       success: false,
//       message: "All fields are required",
//     });
//   }
//   if (!Array.isArray(otherIncome)) {
//     return res.status(200).json({
//       success: false,
//       message: "'otherIncome' should be an array",
//     });
//   }

//   const budget = { month, year, income, otherIncome, userId };

//   budgetService
//     .create(budget)
//     .then((response) => {
//       res.status(201).json({
//         success: true,
//         message: "Budget-plan income created successfully",
//         budget: response,
//       });
//     })
//     .catch((error) => {
//       console.error("Error creating budget:", error);
//       res.status(500).json({
//         success: false,
//         message: "Failed to create budget",
//         error: error.message,
//       });
//     });
// };


exports.update = (req, res) => {
  //#swagger.tags = ['Budgetplan-income']
  const { budgetId } = req.params;
  const budgetData = req.body;

  budgetService
    .updateBudget(budgetId, budgetData)
    .then((updatedBudget) => {
        res.status(201).json({
        success: true,
        message: "Budget-plan updated successfully",
        budget: updatedBudget,
      });
    })
    .catch((error) => {
      console.error("Error updating budget:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update budget",
        error: error.message,
      });
    });
};

exports.getById = (req, res) => {
  //#swagger.tags = ['Budgetplan-income']
  const { budgetId } = req.params;

  if (!budgetId) {
    return res.status(200).json({
      statusCode: "1",
      message: "BudgetId is required",
    });
  }

  budgetService
    .getBudgetById(budgetId)
    .then((response) => {
      res.status(201).json({
        success: true,
        message: "Budget-plan income data retrieved successfully",
        budget: response,
      });
    })
    .catch((error) => {
      if(error.statusCode === "1" && error.message === "Data Not Found"){
        return res.status(200).json({
          statusCode:error.statusCode,
          message:error.message
        })
      }
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve budget",
        error: error.message,
      });
    });
};

exports.view = (req, res) => {
  //#swagger.tags = ['Budgetplan-income']
  const { month, year, userId } = req.query;

  if (!month || !year || !userId) {
    return res.status(200).json({
      success: false,
      message: "Month, Year, and UserId are required",
    });
  }

  budgetService
    .View({ month, year, userId })
    .then((response) => {
      res.status(201).json({
        success: true,
        message: `Budget-plan income ${month} retrieved successfully`,
        budget: response,
      });
    })
    .catch((error) => {
      if(error.statusCode === "1" && error.message === "Budget not found for the specified month, year, and user"){
        return res.status(200).json({
          statusCode:error.statusCode,
          message:error.message
        })
      }
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve budget",
        error: error.message,
      });
    });
};
exports.delete = (req, res) => {
  //#swagger.tags = ['Budgetplan-income']
  const { budgetId } = req.params;

  if (!budgetId) {
    return res.status(200).json({
      success: false,
      message: "BudgetId is required",
    });
  }

  budgetService
    .deleteBudget(budgetId)
    .then((response) => {
      res.status(201).json({
        success: true,
        message: response.message,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Failed to delete budget",
        error: error.message,
      });
    });
};

exports.calculateBudget = (req, res) => {
  //#swagger.tags = ['Budgetplan-income']
  const { month, year, userId } = req.query;

  if (!month || !year || !userId) {
    return res.status(200).json({
      success: false,
      message: "Month, Year, and UserId are required",
    });
  }

  budgetService
    .calculateBudget(month, year, userId)
    .then((budgetCalculation) => {
      res.status(201).json({
        success: true,
        message: "Budget calculated successfully",
        budget: budgetCalculation,
      });
    })
    .catch((error) => {
      if((error.statusCode === "1" && error.message === "No budget found for the selected month and year") || (error.statusCode === "1" && error.message === "No expenses allocation found for the selected month and year")){
        return res.status(200).json({
          statusCode:error.statusCode,
          message:error.message
        })
      }
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Failed to calculate budget",
        error: error.message,
      });
    });
};
