const customDao = require("../../Dao/Goal-Tracker/customDao");
const emailDao = require("../../Dao/Login/emailDao");
exports.upsert = (customData) => {
  return new Promise(async (resolve, reject) => {
    try {
      const {
        userId,
        planName,
        estimatedCost,
        plannedYear,
        inflationRate,
        expectedReturn,
        currentSavings,
      } = customData;

      const user = await emailDao.findUserById(userId);
      if (!user) {
        return reject({
          statusCode: "1",
          success: false,
          message: "User not found!",
        });
      }

      // Future cost calculation
      const yearlyRate = inflationRate / 100;
      const futureCost = Math.round(
        estimatedCost * Math.pow(1 + yearlyRate, plannedYear)
      );

      const futureValueSavings = Math.round(
        currentSavings * Math.pow(1 + expectedReturn / 100, plannedYear)
      );
      const TargetedFutureValue = futureCost - futureValueSavings;
      const monthlyRate = expectedReturn / 100 / 12;
      const totalMonths = plannedYear * 12;

      const compoundedRate = Math.pow(1 + monthlyRate, totalMonths);
      const monthlySip =
        TargetedFutureValue > 0
          ? (TargetedFutureValue * monthlyRate) /
            ((compoundedRate - 1) * (1 + monthlyRate))
          : 0;

      const investmentAmount = monthlySip * totalMonths;
      const futureValue =
        monthlySip * ((compoundedRate - 1) / monthlyRate) * (1 + monthlyRate);
      const returnsRate = futureValue - investmentAmount;

      const calculatedData = {
        userId,
        planName,
        estimatedCost,
        plannedYear,
        inflationRate,
        expectedReturn,
        currentSavings,
        futureCost,
        futureValueSavings,
        TargetedFutureValue,
        monthlySip: Math.round(monthlySip),
        investmentAmount: Math.round(investmentAmount),
        returnsRate: Math.round(returnsRate),
        targetedAmount: Math.round(investmentAmount + returnsRate),
      };

      // Log calculated data
      console.log("Calculated data:", calculatedData);

      // Save custom plan data to the database
      const customDataDetails = await customDao.createCustom(calculatedData);
      if (!customDataDetails) {
        return reject({
          statusCode: "1",
          success: false,
          message: "Failed to save data!",
        });
      }

      resolve({
        statusCode: "0",
        success: true,
        message: "CustomPlan Data created successfully!",
        data: [customDataDetails],
      });
    } catch (error) {
      console.error("Error in upsert:", error);
      return reject({
        statusCode: "2",
        success: false,
        message: "Internal Server Error",
        error: error.message,
      });
    }
  });
};

exports.getAll = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const custom = await customDao.getCustomById(userId);

      if (!custom || custom.length === 0) {
        return reject({
          statusCode: "1",
          message: "custom plan data not found",
        });
      }

      // Successfully retrieve data
      return resolve({
        statusCode: "0",
        success: true,
        message: "custom Data retrieved successfully!",
        data: custom,
      });
    } catch (error) {
      // Handle any errors that occur during the process
      return reject({
        statusCode: "2",
        message: "An error occurred while retrieving data",
        error: error.message,
      });
    }
  });
};

exports.update = (planId, customData) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Destructure the input data
      const {
        userId,
        planName,
        plannedYear,
        estimatedCost,
        inflationRate,
        expectedReturn,
        currentSavings,
      } = customData;

     
      const user = await emailDao.findUserById(userId);
      if (!user) {
        return reject({
          statusCode: "1",
          success: false,
          message: "User not found!",
        });
      }


      // Future cost calculation
      const yearlyRate = inflationRate / 100;
      const futureCost = Math.round(
        estimatedCost * Math.pow(1 + yearlyRate, plannedYear)
      );

      const futureValueSavings = Math.round(
        currentSavings * Math.pow(1 + expectedReturn / 100, plannedYear)
      );
      const TargetedFutureValue = futureCost - futureValueSavings;
      const monthlyRate = expectedReturn / 100 / 12;
      const totalMonths = plannedYear * 12;

      const compoundedRate = Math.pow(1 + monthlyRate, totalMonths);
      const monthlySip =
        TargetedFutureValue > 0
          ? (TargetedFutureValue * monthlyRate) /
            ((compoundedRate - 1) * (1 + monthlyRate))
          : 0;

      const investmentAmount = monthlySip * totalMonths;
      const futureValue =
        monthlySip * ((compoundedRate - 1) / monthlyRate) * (1 + monthlyRate);
      const returnsRate = futureValue - investmentAmount;

      // Prepare the updated data object
      const updatedData = {
        userId,
        planName,
        estimatedCost,
        plannedYear,
        inflationRate,
        expectedReturn,
        currentSavings,
        futureCost,
        futureValueSavings,
        TargetedFutureValue,
        monthlySip: Math.round(monthlySip),
        investmentAmount: Math.round(investmentAmount),
        returnsRate: Math.round(returnsRate),
        targetedAmount: Math.round(investmentAmount + returnsRate),
      };

      // Check if the plan exists in the database
      const planExists = await customDao.findCustomById(planId);
      if (!planExists) {
        return reject({
          statusCode: "1",
          success: false,
          message: "Plan not found!",
        });
      }

      // Update the plan data in the database
      const updatedCustom = await customDao.updateCustom(planId, updatedData);
      if (!updatedCustom) {
        return reject({
          statusCode: "1",
          success: false,
          message: "Failed to update the custom plan!",
        });
      }

      resolve({
        statusCode: "0",
        success: true,
        message: "CustomPlan updated successfully!",
        data: updatedCustom,
      });
    } catch (error) {
      console.error("Error in update:", error);
      reject({
        statusCode: "2",
        success: false,
        message: "An error occurred!",
        error: error.message,
      });
    }
  });
};


exports.delete = async (planId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const custom = await customDao.findCustomById(planId);
      if (!custom) {
        return reject({
          statusCode: "1",
          success: false,
          message: "Custom Data not found!",
        });
      }
      await customDao.deleteCustomById(planId);
      return resolve({
        statusCode: "0",
        success: true,
        message: "custom Data deleted successfully!",
      });
    } catch (error) {
      return reject({
        statusCode: "2",
        success: false,
        message: "An error occurred",
        error: error.message,
      });
    }
  });
};
