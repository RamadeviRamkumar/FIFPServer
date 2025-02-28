const childEducationService = require("../../Service/Goal-Tracker/childEducationService");
const regex = require("../../Regex/regex");
// const logger = require('../../utils/logger')


exports.createExpense = async (req, res) => {
  //#swagger.tags=['ChildEducation-Expenses']
  const { userId, childId, firstchild, secondchild, inflationrate, returnrate, current_savings } = req.body;

  // Input Validations
  if (!userId) {
    return res.status(200).json({ message: "UserId field is required" });
  }
  if (!Array.isArray(firstchild) || firstchild.length === 0) {
    return res.status(200).json({ message: "FirstChild should be a non-empty array" });
  }
  if (typeof inflationrate !== 'number' || isNaN(inflationrate)) {
    return res.status(200).json({ message: "InflationRate must be a valid number" });
  }
  if (typeof returnrate !== 'number' || isNaN(returnrate)) {
    return res.status(200).json({ message: "ReturnRate must be a valid number" });
  }
  if (typeof current_savings !== 'number' || isNaN(current_savings)) {
    return res.status(200).json({ message: "CurrentSavings must be a valid number" });
  }
  if (secondchild && (!Array.isArray(secondchild) || secondchild.length === 0)) {
    return res.status(200).json({ message: "SecondChild should be an array if provided" });
  }
  childEducationService
    .createExpense(req.body)
    .then((response) => {
      res.status(201).json(response)
    })
    .catch((error) => {
      const statusCode = error.statusCode === "1" ? 200 : 500
      res.status(statusCode).json({
        statusCode: error.statusCode || "2",
        success: false,
        message: error.message || "Internal server error",
      })
    })

}

exports.getAllEducationPlan = async (req, res) => {
  //#swagger.tags=['ChildEducation-Expenses']
  const { userId } = req.query;

  if (!userId) {
    return res.status(200).json({
      statusCode: "1",
      message: "Missing required parameter: userId",
    });
  }

  try {
    const result = await childEducationService.getAll(userId);
    logger.info(`${userId}- Child Education Plan Fetched Successfully`)
    res.status(result.statusCode).json(result);
  } catch (error) {
    if (
      error.statusCode === "1" &&
      error.message === "No education plans found for the user"
    ) {
      logger.error(`${userId} - Child Education Plan Not Available`)
      return res.status(200).json({
        statusCode: error.statusCode,
        message: error.message,
        data: [],
      });
    }
    console.error("Controller: Error in getAllEducationPlan:", error);
    logger.error(`${userId} - Child Education Plan Get Api Internal Server Error`)
    res.status(500).json({
      statusCode: "1",
      message: "Failed to retrieve education plans data",
    });
  }
};

exports.createPdf = async (req, res) => {
  //#swagger.tags=['ChildEducation-Expenses']
  const { userId, pdfId } = req.body;
  if (!userId) {
    return res.status(200).json({
      success: false,
      message: "userId is required"
    })
  }
  childEducationService
    .upsert(req.body)
    .then((response) => {
      res.status(201).json(response)
    })
    .catch((error) => {
      const statusCode = error.statusCode === "1" ? 200 : 500
      res.status(statusCode).json({
        statusCode: error.statusCode || "2",
        success: false,
        message: error.message || "Internal server error",
      })
    })
}

exports.getPdf = async (req, res) => {
  //#swagger.tags=['ChildEducation-Expenses']
  const { userId } = req.query;
  if (!userId) {
    return res.status(200).json({
      success: false,
      message: "userId is required"
    })
  }
  childEducationService
    .getPdf(req.query)
    .then((response) => {
      res.status(200).json(response)
    })
    .catch((error) => {
      const statusCode = error.statusCode === "1" ? 200 : 500
      res.status(statusCode).json({
        statusCode: error.statusCode || "2",
        success: false,
        message: error.message || "Internal server error"
      })
    })
}
