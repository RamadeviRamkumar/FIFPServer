const houseBuyingPlanService = require("../../Service/Goal-Tracker/houseBuyingPlanService");

exports.Create = (req, res) => {
  //#swagger.tags = ['House-Buying-Plan']
  const {
    userId,
    plannedYear,
    estimatedCost,
    purchasingMode,
    inflationRate,
    expectedReturn,
    loanPercentage,
    loanTenure,
    downpayment,
    currentSavings,
  } = req.body;

  // Savings method
  if (purchasingMode === false) {
    if (
      !plannedYear ||
      !estimatedCost ||
      !inflationRate ||
      !expectedReturn 
      // !currentSavings
    ) {
      return res.status(200).json({
        statusCode: "1",
        success: false,
        message: "Missing required fields for Savings method!",
      });
    }
  } else if (purchasingMode === true) {
    // Loan method
    if (
      !plannedYear ||
      !estimatedCost ||
      !inflationRate ||
      !expectedReturn ||
      // !currentSavings ||
      !downpayment ||
      !loanTenure ||
      !loanPercentage
    ) {
      return res.status(400).json({
        statusCode: "1",
        success: false,
        message: "Missing required fields for Loan method!",
      });
    }
  } else {
    return res.status(200).json({
      statusCode: "1",
      success: false,
      message:
        "Invalid purchasingMode value! Must be true (Savings) or false (Loan).",
    });
  }

  // Prepare the vehicleData object
  const houseData = {
    userId,
    plannedYear,
    estimatedCost,
    purchasingMode,
    inflationRate,
    expectedReturn,
    loanPercentage: purchasingMode === true ? loanPercentage : undefined,
    loanTenure: purchasingMode === true ? loanTenure : undefined,
    downpayment: purchasingMode === true ? downpayment : undefined,
    currentSavings,
  };

  houseBuyingPlanService
    .upsert(houseData)
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

exports.getById = (req, res) => {
  //#swagger.tags = ['House-Buying-Plan']
  const { houseId } = req.params;

  houseBuyingPlanService
    .getById(houseId)
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
  //#swagger.tags = ['House-Buying-Plan']
  const { userId } = req.query;

  if (!userId) {
    return res.status(200).json({
      statusCode: "1",
      success: false,
      message: "UserId is required!",
    });
  }

  houseBuyingPlanService
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
  //#swagger.tags = ['House-Buying-Plan']
  const { houseId } = req.params;
  const {
    userId,
    plannedYear,
    estimatedCost,
    inflationRate,
    expectedReturn,
    purchasingMode,
    loanPercentage,
    loanTenure,
    downpayment,
    currentSavings,
  } = req.body;

  // Savings method
  if (purchasingMode === false) {
    if (
      !plannedYear ||
      !estimatedCost ||
      !inflationRate ||
      !expectedReturn 
      // !currentSavings
    ) {
      return res.status(200).json({
        statusCode: "1",
        success: false,
        message: "Missing required fields for Savings method!",
      });
    }
  } else if (purchasingMode === true) {
    // Loan method
    if (
      !plannedYear ||
      !estimatedCost ||
      !inflationRate ||
      !expectedReturn ||
      // !currentSavings ||
      !downpayment ||
      !loanTenure ||
      !loanPercentage
    ) {
      return res.status(400).json({
        statusCode: "1",
        success: false,
        message: "Missing required fields for Loan method!",
      });
    }

    // const calculatedDownpayment = estimatedCost * 0.3;
    // downpayment = downpayment || calculatedDownpayment;
  } else {
    return res.status(200).json({
      statusCode: "1",
      success: false,
      message:
        "Invalid purchasingMode value! Must be true (Savings) or false (Loan).",
    });
  }

  // Prepare the vehicleData object
  const houseData = {
    userId,
    plannedYear,
    estimatedCost,
    purchasingMode,
    inflationRate,
    expectedReturn,
    loanPercentage: purchasingMode === true ? loanPercentage : undefined,
    loanTenure: purchasingMode === true ? loanTenure : undefined,
    downpayment: purchasingMode === true ? downpayment : undefined,
    currentSavings,
  };

  houseBuyingPlanService
    .update(houseId, houseData, userId)
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
  //#swagger.tags = ['House-Buying-Plan']
  const { houseId } = req.params;

  houseBuyingPlanService
    .delete(houseId)
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
