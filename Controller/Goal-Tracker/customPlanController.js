const customService = require("../../Service/Goal-Tracker/customPlanService");

exports.Create = (req, res) => {
  //#swagger.tags = ['Custom-Buying-Plan']
  const {
    userId,
    planName,
    estimatedCost,
    plannedYear,
    inflationRate,
    expectedReturn,
    currentSavings,
  } = req.body;

  const customData = {
    userId,
    planName,
    estimatedCost,
    plannedYear,
    inflationRate,
    expectedReturn,
    currentSavings,
  };

  customService
    .upsert(customData)
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

exports.getAll = (req, res) => {
  //#swagger.tags = ['Custom-Buying-Plan']
  const { userId } = req.query;

  if (!userId) {
    return res.status(200).json({
      statusCode: "1",
      success: false,
      message: "UserId is required!",
    });
  }

  customService
    .getAll(userId)
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

exports.update = (req, res) => {
  //#swagger.tags = ['Custom-Buying-Plan']
  const { planId } = req.params;

  const {
    userId,
    planName,
    estimatedCost,
    plannedYear,
    inflationRate,
    expectedReturn,
    currentSavings,
  } = req.body;

  const customData = {
    userId,
    planName,
    estimatedCost,
    plannedYear,
    inflationRate,
    expectedReturn,
    currentSavings,
  };

  customService
    .update(planId, customData, userId)
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

exports.delete = (req, res) => {
  //#swagger.tags = ['Custom-Buying-Plan']
  const { planId } = req.params;

  customService
    .delete(planId)
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
