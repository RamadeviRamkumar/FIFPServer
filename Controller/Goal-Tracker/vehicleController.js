const vehicleService = require("../../Service/Goal-Tracker/vehiclePlanService");

exports.Create = (req, res) => {
  //#swagger.tags = ['Vehicle-Buying-Plan']
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
      !loanPercentage ||
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

  const vehicleData = {
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
    loanTenure,
    downpayment,
    currentSavings,
  };

  vehicleService
    .upsert(vehicleData)
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
 //#swagger.tags = ['Vehicle-Buying-Plan']
  const { vehicleId} = req.params;

  vehicleService
    .getById(vehicleId)
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
  //#swagger.tags = ['Vehicle-Buying-Plan']
  const { userId } = req.query;

  if (!userId) {
    return res.status(200).json({
      statusCode: "1",
      success: false,
      message: "UserId is required!",
    });
  }

  vehicleService
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
  //#swagger.tags = ['Vehicle-Buying-Plan']
  const { vehicleId } = req.params;

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
    
  } else {
    return res.status(200).json({
      statusCode: "1",
      success: false,
      message:
        "Invalid purchasingMode value! Must be true (Savings) or false (Loan).",
    });
  }

  // Prepare the vehicleData object
  const vehicleData = {
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

  vehicleService
    .update(vehicleId, vehicleData, userId)
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
  //#swagger.tags = ['Vehicle-Buying-Plan']
  const { vehicleId } = req.params;

  vehicleService
    .delete(vehicleId)
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
