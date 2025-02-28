const masterService = require("../../Service/Category/masterService");
// const logger = require("../../utils/logger");

exports.upsertExpense = (req, res) => {
  //#swagger.tags=['Master-Expenses']
  const { userId, title, masterId } = req.body;
  if ((!userId, !title)) {
    return res.status(200).json({
      statusCode: "1",
      success: false,
      message: "All fields are required!",
    });
  }
  const expensesMaster = {
    userId,
    title,
    masterId,
  };
  masterService
    .upsertExpense(expensesMaster)
    .then((response) => {
      res.status(201).json(response);
    })
    .catch((error) => {
      const statusCode = error.statusCode === "1" ? 200 : 500;
      res.status(statusCode).json({
        statusCode: error.statusCode || "2",
        success: false,
        message: error.message || "Internal server error",
      });
    });
};

exports.getAllExpenses = (req, res) => {
  //#swagger.tags = ['Master-Expenses']
  const { userId } = req.query;
  if (!userId) {
    return res.status(200).json({ 
      statusCode : "1",
      success : false,
      message: "userId is required!" 
    });
  }
  masterService
    .getAllExpenses(userId)
    .then((response) => {
      res.status(201).json(response);
    })
    .catch((error) => {
      const statusCode = error.statusCode === "1" ? 200 : 500;
      res.status(statusCode).json({
        statusCode: error.statusCode || "2",
        success: false,
        message: error.message || "Internal server error",
      });
    });
};

exports.getExpenseById = (req, res) => {
  //#swagger.tags=['Master-Expenses']
  const { masterId } = req.params;
  if (!masterId) {
    return res.status(200).json({ 
      statusCode : "1",
      success : false,
      message : "masterId is required!" 
    });
  }
  masterService
    .getExpenseById(masterId)
    .then((response) => {
      res.status(201).json(response);
    })
    .catch((error) => {
      const statusCode = error.statusCode === "1" ? 200 : 500;
      res.status(statusCode).json({
        statusCode: error.statusCode || "2",
        success: false,
        message: error.message || "Internal server error",
      });
    });
};

exports.deleteById = (req, res) => {
  //#swagger.tags=['Master-Expenses']
  const { masterId } = req.params;
  if (!masterId) {
    logger.error(`${userId}-masterId is required`);
    return res.status(200).json({ 
      statusCode : "1",
      success : false,
      message : "masterId is required!" 

    });
  }
  masterService
    .deleteById(masterId)
    .then((response) => {
      res.status(201).json(response);
    })
    .catch((error) => {
      const statusCode = error.statusCode === "1" ? 200 : 500;
      res.status(statusCode).json({
        statusCode: error.statusCode || "2",
        success: false,
        message: error.message || "Internal server error",
      });
    });
};
