const riskService = require("../../Service/personalRiskTolerance/riskService");
// const logger = require("../../utils/logger");

exports.createRiskProfile = (req, res) => {
  //#swagger.tags=['PersonalRisk-Tolerance']
  const { userId, answers, riskId } = req.body;

  if (!userId || !answers) {
    logger.error("Validation Error: userId and answers fields are required.");
    return res.status(200).json({
      statusCode: "1",
      success: false,
      message: "userId and answers fields are required.",
    });
  }

  if (!Array.isArray(answers)) {
    logger.error("Validation Error: answers must be an array.");
    return res.status(200).json({
      statusCode: "1",
      success: false,
      message: "Answers must be provided as an array.",
    });
  }

  if (!answers.every((item) => item && item.answer)) {
    logger.error(
      "Validation Error: Each answer must have a valid 'answer' field."
    );
    return res.status(200).json({
      statusCode: "1",
      success: false,
      message: "Each answer must have a valid 'answer' field.",
    });
  }

  const RiskProfile = { userId, answers, riskId };

  riskService
    .createRiskProfile(RiskProfile)
    .then((response) => {
      logger.info(`${userId}-PersonalRisk Data created/updated successfully.`);
      res.status(201).json(response);
    })
    .catch((error) => {
      logger.error(`${userId}-Error occurred: ${error.message}`);
      res.status(200).json({
        statusCode: error.statusCode || "2",
        success: false,
        message: error.message || "Internal server error",
      });
    });
};

exports.getAllRisk = (req, res) => {
  //#swagger.tags=['PersonalRisk-Tolerance']
  const { userId } = req.query;
  if (!userId) {
    logger.error(`${userId}-userId is Required`);
    return res.status(200).json({ message: "userId is required" });
  }
  riskService
    .getAllRisk(userId)
    .then((response) => {
      logger.info(`{userId}-personalRisk Data Retrived Successfully`);
      res.status(201).json(response);
    })
    .catch((error) => {
      logger.error(`${userId}-Error occurred: ${error.message}`);
      res.status(200).json({
        statusCode: error.statusCode || "2",
        success: false,
        message: error.message || "Internal server error",
      });
    });
};
