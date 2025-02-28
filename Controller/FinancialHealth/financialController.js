const financialService = require("../../Service/FinancialHealth/financialService");
// const logger = require("../../utils/logger");

exports.upsert = (req, res) => {
  //#swagger.tags=['Financial-Health-Checkup']
  const {
    userId,
    financeId,
    income,
    expenses,
    totalSavings,
    investments,
    totalDebtAmount,
    monthlyEMI,
    insurance,
    emergencyFund,
  } = req.body;

  const financialData = {
    userId,
    financeId,
    income,
    expenses,
    totalSavings,
    investments,
    totalDebtAmount,
    monthlyEMI,
    insurance,
    emergencyFund,
  };
  financialService
    .upsert(financialData)
    .then((response) => {
      res.status(201).json(response);
    })
   
    .catch((error) => {
      logger.error(`${userId} - Financial Data Creation Api Internal Server Error`)
      console.error("Error creating financial data:", error);

      const statusCode = error.statusCode === "1" ? 200 : 500;
      res.status(statusCode).json({
        statusCode: error.statusCode || "2",
        success: false,
        message: error.message || "Internal server error",
      });
    });
};

exports.getUserFinancial = (req, res) => {
  //#swagger.tags=['Financial-Health-Checkup']
  const { userId } = req.query;
  if (!userId) {
    return res.status(200).json({ message: "UserId is required" });
  }
  financialService
    .getUserFinancial(userId)
    .then((response) => {
      logger.info(`${userId} - Financial Data Fetched Sucessfully `);
      res.status(201).json(response);
    })
    .catch((error) => {

      if (
        (error.statusCode === "1" && error.message === "User not found") ||
        (error.statusCode === "1" &&
          error.message === "Financial data not found for this user")
      ) {
        logger.error(`${userId} - Financial Data Not Found`);
        return res.status(200).json({
          statusCode: error.statusCode,
          message: error.message,
        });

      }
      console.error(error);
      logger.error(
        `${userId} - Financial Data Fetch Api Internal Server Error`
      );
      res.status(500).json({ error: "Internal server error" });
    });
};

exports.getAll = (req, res) => {
  //#swagger.tags=['Financial-Health']
  const { userId } = req.query
  if (!userId) {
    return res.status(200).json({ message: "UserId is required" });
  }
  financialService
    .getAll(userId)
    .then((response)=>{
      res.status(201).json(response)
    })
    .catch((error) => {
      const statusCode = error.statusCode === "1" ? 200 : 500;
      res.status(statusCode).json({
        statusCode: error.statusCode || "2",
        success: false,
        message: error.message || "Internal server error",
      });
    });
}
