const debtService = require("../../Service/Debt-Clearance/debtService");
// const logger = require("../../utils/logger");

exports.createDebt = async (req, res) => {
  //#swagger.tags=['Debt-Clearance']
  try {
    const { userId, source } = req.body;
    if (!userId || !source || !Array.isArray(source) || source.length === 0) {
      // logger.error(
      //   `${userId}-Invalid request data. Please provide a valid userId and source array.`
      // );
      return res.status(200).json({
        statusCode: "1",
        message:
          "Invalid request data. Please provide a valid userId and source array.",
      });
    }
    const result = await debtService.createDebt(userId, source);
    // logger.info(`${userId}-Debt clearance created successfully`)
    res.status(201).json(result);
  } catch (error) {
    // logger.error(`${userId}-Error creating/updating debt clearance:`, error);
    res.status(500).json({
      statusCode: "1",
      message: "Internal Server Error",
    });
  }
};

exports.getAllDebts = async (req, res) => {
  //#swagger.tags=['Debt-Clearance']
  try {
    const { userId } = req.query;
    if (!userId) {
      // logger.error(`${userId}-Invalid request. Please provide a valid userId.`);
      return res.status(200).json({
        statusCode: "1",
        message: "Invalid request. Please provide a valid userId.",
      });
    }

    const result = await debtService.getAllDebts(userId);
    res.status(201).json(result);
  } catch (error) {
    if (
      error.statusCode === "1" &&
      error.message === "No debt clearance records found for the user."
    ) {
      return res.status(200).json({
        statusCode: error.statusCode,
        message: error.message,
      });
    }
    // logger.error(`${userId}-Error fetching debt clearance records:`, error);
    res.status(500).json({
      statusCode: "1",
      message: "Internal Server Error",
    });
  }
};

exports.getSnowball = async (req, res) => {
  //#swagger.tags=['Debt-Clearance']
  const { userId, initialSnowBall } = req.body;
  if (!userId || !initialSnowBall) {
    return res.status(200).json({
      statusCode: "1",
      success: false,
      message: "All fields are required!",
    });
  }

  debtService
    .getSnowball(userId, initialSnowBall)
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({
        statusCode: "2",
        success: false,
        message: error.message || "Internal Server Error",
      });
    });
};

exports.payEMI = async (req, res) => {
  //#swagger.tags=['Debt-Clearance']
  try {
    const { userId, loanId, emiPaid } = req.body;
    if (!emiPaid) {
      // logger.error(`${userId}-EMI amount is required`);
      return res.status(200).json({ message: "EMI amount is required." });
    }

    const result = await debtService.payEMI(userId, loanId, emiPaid);
    res.status(201).json(result);
  } catch (error) {
    // logger.error(`${userId}-Internal server error`);
    res.status(500).json({ message: "Internal Server Error." });
  }
};



