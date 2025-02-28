const realityService = require("../../Service/Reality/expensesService");
// const logger = require('../../utils/logger')

exports.createExpense = (req, res) => {
  //#swagger.tags = ['Reality-Expenses']
  const { userId, month, year, title, categories } = req.body;
  if ((!userId, !month, !year, !title, !categories)) {
    return res.status(200).json({ error: "All fields are required" });
  }
  const expensesData = {
    userId,
    month,
    year,
    title,
    categories,
  };
  realityService
    .createExpense(expensesData)
    .then((response) => {
      logger.info(`${userId} -Expenses Created Sucessfully`)
      res.status(201).json(response);
    })
    .catch((error) => {
      logger.error(`${userId} - Expenses Create Api Internal Server`)
      console.log(error);
      res.status(500).json({ error: "Internal Server error" });
    });
};

exports.getAllExpenses = (req, res) => {
  //#swagger.tags = ['Reality-Expenses']
  const { userId } = req.query;
  if (!userId) {
    return res.status(200).json({ message: "userId is required" });
  }
  realityService
    .getAllExpenses(userId)
    .then((response) => {
      logger.info(`${userId} - Expenses Fetched Sucessfully`)
      res.status(201).json(response);
    })
    .catch((error) => {
      if(error.statusCode === "1" && error.message === "No expenses found for the provided userId"){
       logger.error(`${userId} - Expenses Data Not Found`)
        return res.status(200).json({
          statusCode:error.statusCode,
          message:error.message
        })
      }
      logger.error(`${userId} - Expensed Data Get Api Internal Server Error`)
      console.log(error);
      res.status(500).json({ error: "Internal Server error" });
    });
};

exports.getExpenseById = (req, res) => {
  //#swagger.tags = ['Reality-Expenses']
  const { expensesId } = req.params;

  if (!expensesId) {
    return res.status(200).json({
      success: false,
      message: "expensesId is required",
    });
  }

  realityService
    .getExpenseById(expensesId)
    .then((response) => {
      res.status(201).json({
        success: true,
        message: "Reality Expenses retrieved successfully",
        data: response,
      });
    })
    .catch((error) => {
      if(error.statusCode === "1" && error.message === "expensesId not found"){
        return res.status(200).json({
          statusCode:error.statusCode,
          message:error.message
        })
      }
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve expenses",
        error: error.message,
      });
    });
};

exports.updateExpense = (req, res) => {
  //#swagger.tags = ['Reality-Expenses']
  const { expensesId } = req.params;
  const { title, categories } = req.body;

  if (!title || !categories || !expensesId) {
    return res.status(200).json({ error: "All fields are required" });
  }

  const updateData = {
    title,
    categories,
  };

  realityService
    .updateExpense(expensesId, updateData) // Pass expensesId and updateData explicitly
    .then((response) => {
      res.status(201).json(response);
    })
    .catch((error) => {
      console.error(error.message);
      res.status(500).json({ error: "Internal Server error" });
    });
};

exports.deleteExpense = (req, res) => {
  //#swagger.tags = ['Reality-Expenses']
  const { expensesId } = req.params;

  if (!expensesId) {
    return res.status(200).json({
      success: false,
      message: "expensesId is required",
    });
  }

  realityService
    .deleteExpense(expensesId)
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
