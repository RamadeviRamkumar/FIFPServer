const budgetService = require("../../Service/Reality/budgetService");
const regex = require('../../Regex/regex')
// const logger = require('../../utils/logger')

exports.createIncome = (req, res) => {
  //#swagger.tags = ['Reality-budgetIncome']
  const { month, year, income, otherIncome , userId } = req.body;

  
  if (!month || !year || !income || !userId) {
    const missingParams = []
    if(!month)missingParams.push("Month");
    if(!year)missingParams.push("Year");
    if(!income)missingParams.push("Income");
    if(!userId)missingParams.push("UserID");
    return res.status(200).json({
      message: `${missingParams.join(',')}fields are required`,
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
  if(otherIncome){
    if (!Array.isArray(otherIncome)) {
      return res.status(200).json({
        success: false,
        message: "'otherIncome' should be an array",
      });
  }
 
    processedOtherIncome = otherIncome
  }

  const budget = { month, year, income, otherIncome:processedOtherIncome, userId };

  budgetService
    .createIncome(budget)
    .then((response) => {
      logger.info(`${userId} - Budged Created Successfully`)
      res.status(201).json({
        success: true,
        message: "Budget created successfully",
        data: response,
      });
    })
    .catch((error) => {
      logger.error(`${userId} - Budged Created Internal Server Error`)
      console.error("Error creating budget:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create budget",
        error: error.message,
      });
    });
};

exports.updateIncome = (req, res) => {
  //#swagger.tags = ['Reality-budgetIncome']
  const { budgetId } = req.params;
  const budgetData = req.body;

  budgetService
    .updateIncome(budgetId, budgetData)
    .then((updatedBudget) => {
      res.status(201).json({
        success: true,
        message: "Budget updated successfully",
        data: updatedBudget,
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

exports.getIncomeById = (req, res) => {
  //#swagger.tags = ['Reality-budgetIncome']
  const { budgetId } = req.params;

  if (!budgetId) {
    return res.status(200).json({
      success: false,
      message: "BudgetId is required",
    });
  }

  budgetService
    .getIncomeById(budgetId)
    .then((response) => {
      res.status(201).json({
        success: true,
        message: "Budget retrieved successfully",
        data: response,
      });
    })
    .catch((error) => {
      if(error.statusCode ==="1" && error.message === "Budget not found"){
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

exports.viewIncome = (req, res) => {
  //#swagger.tags = ['Reality-budgetIncome']
  const { month, year, userId } = req.query;

  if (!month || !year || !userId) {
    return res.status(200).json({
      success: false,
      message: "Month, Year, and UserId are required",
    });
  }

  budgetService
    .viewIncome({ month, year, userId })
    .then((response) => {
      logger.info(`${userId}-Budged fetched Sucessfully`)
      res.status(201).json({
        success: true,
        message: "Budget retrieved successfully",
        data: response,
      });
    })
    .catch((error) => {
      if(error.statusCode === "1" && error.message === "Data Not Found"){
        logger.error(`${userId} - Budget Data Not Found`)
        return res.status(200).json({
          statusCode:error.statusCode,
          message:error.message,
          data:[]
        })
      }
      console.error(error);
      logger.error(`${userId} - Budget Get Api Internal Server Error`)
      res.status(500).json({
        success: false,
        message: "Failed to retrieve budget",
        error: error.message,
      });
    });
};
exports.deleteIncome = (req, res) => {
  //#swagger.tags = ['Reality-budgetIncome']
  const { budgetId } = req.params;

  if (!budgetId) {
    return res.status(200).json({
      success: false,
      message: "BudgetId is required",
    });
  }

  budgetService
    .deleteIncome(budgetId)
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
