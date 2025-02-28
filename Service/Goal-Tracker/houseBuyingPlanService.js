const houseBuyingPlanDao = require("../../Dao/Goal-Tracker/houseBuyingPlanDao");
const emailDao = require("../../Dao/Login/emailDao");

exports.upsert = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const {
        userId,
        plannedYear,
        estimatedCost,
        purchasingMode,
        inflationRate,
        expectedReturn,
        currentSavings,
        loanPercentage,
        loanTenure,
        downpayment,
      } = data;

      // Validate required input fields
      if (
        !userId ||
        !plannedYear ||
        !estimatedCost ||
        purchasingMode === undefined
      ) {
        return reject({
          statusCode: "1",
          success: false,
          message: "Missing required fields in the input data!",
        });
      }

      // Check if the user exists
      const user = await emailDao.findUserById(userId);
      if (!user) {
        return reject({
          statusCode: "1",
          success: false,
          message: "User not found!",
        });
      }
      const existingData = await houseBuyingPlanDao.existingData(userId);
      if (existingData) {
        return reject({
          statusCode: "1",
          success: false,
          message: "House-Plan Data already exists.."
        })
      }
      let houseData = {};
      let responseMessage = "";

      // Future cost calculation
      const yearlyRate = inflationRate / 100;


      const futureCost = Math.round(
        estimatedCost * Math.pow(1 + yearlyRate, plannedYear)
      );

      if (purchasingMode === true) {
        // Loan Mode
        if (
          loanTenure === undefined ||
          downpayment === undefined ||
          loanPercentage === undefined
        ) {
          return reject({
            statusCode: "3",
            success: false,
            message: "Missing required fields for Loan Mode!",
          });
        }
        const monthlyRate = expectedReturn / 100 / 12;
        const totalMonths = plannedYear * 12;
        const monthlySip =
          downpayment > 0
            ? (downpayment * monthlyRate) /
            ((Math.pow(1 + monthlyRate, totalMonths) - 1) * (1 + monthlyRate))
            : 0;
        const investmentAmount = monthlySip * totalMonths;
        const futureValue =
          monthlySip *
          ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) *
          (1 + monthlyRate);

        const returnsRate = futureValue - investmentAmount;
        const targetedAmount = Math.round(investmentAmount + returnsRate);

        const futureValueSavings = Math.round(currentSavings * Math.pow(1 + (expectedReturn / 100), plannedYear));

        const totalValue = Math.round(downpayment + futureValueSavings);

        const TargetedFutureValue = Math.round(futureCost - totalValue);
        const monthlyInterestRate = loanPercentage / 100 / 12;
        const totalMonthstenure = loanTenure * 12;

        // EMI calculation using standard formula
        const emi =
          (TargetedFutureValue *
            monthlyInterestRate *
            Math.pow(1 + monthlyInterestRate, totalMonthstenure)) /
          (Math.pow(1 + monthlyInterestRate, totalMonthstenure) - 1);
        const principalAmount = TargetedFutureValue - downpayment;
        const totalAmountPayable = emi * totalMonthstenure;
        const interestAmount = totalAmountPayable - TargetedFutureValue;

        houseData = {
          userId,
          plannedYear,
          purchasingMode,
          estimatedCost,
          inflationRate,
          expectedReturn,
          currentSavings,
          loanPercentage,
          loanTenure,
          downpayment,
          monthlySip: Math.round(monthlySip),
          investmentAmount: Math.round(investmentAmount),
          returnsRate: Math.round(returnsRate),
          targetedAmount: Math.round(investmentAmount + returnsRate),
          futureCost,
          futureValueSavings: Math.round(futureValueSavings),
          totalValue,
          TargetedFutureValue,
          monthlyEMI: Math.round(emi),
          principalAmount: Math.round(TargetedFutureValue),
          interestAmount: Math.round(interestAmount),
          totalAmountPayable: Math.round(totalAmountPayable),
        };

        responseMessage =
          "House-buying-plan Loan method data created successfully!";
      }
      // Savings mode
      else if (purchasingMode === false) {
        const futureValueSavings = Math.round(
          currentSavings * Math.pow(1 + expectedReturn / 100, plannedYear));
        const TargetedFutureValue = futureCost - futureValueSavings;
        const monthlyRate = expectedReturn / 100 / 12;
        const totalMonths = plannedYear * 12;
        const monthlySip =
          TargetedFutureValue > 0
            ? (TargetedFutureValue * monthlyRate) /
            ((Math.pow(1 + monthlyRate, totalMonths) - 1) * (1 + monthlyRate))
            : 0;
        const investmentAmount = monthlySip * totalMonths;
        const futureValue =
          monthlySip *
          ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) *
          (1 + monthlyRate);

        const returnsRate = futureValue - investmentAmount;

        houseData = {
          userId,
          plannedYear,
          estimatedCost,
          inflationRate,
          expectedReturn,
          currentSavings,
          purchasingMode,
          futureCost,
          loanTenure:0,
          downpayment:0,
          loanPercentage:0,
          futureValueSavings,
          TargetedFutureValue,
          monthlySip: Math.round(monthlySip),
          investmentAmount: Math.round(investmentAmount),
          returnsRate: Math.round(returnsRate),
          targetedAmount: Math.round(investmentAmount + returnsRate),
        };

        responseMessage = "Savings via House Buying Plan created successfully!";
      } else {
        return reject({
          statusCode: "3",
          success: false,
          message: "Invalid purchasing mode or missing required fields!",
        });
      }

      // Save vehicle data to the database
      const houseDataDetails = await houseBuyingPlanDao.createHousePlan(
        houseData
      );
      resolve({
        statusCode: "0",
        success: true,
        message: responseMessage,
        data: [houseDataDetails],
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

exports.getById = async (houseId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const plan = await houseBuyingPlanDao.findPlanById(houseId);
      if (!plan) {
        return reject({
          statusCode: "1",
          success: false,
          message: "House-Plan data not found!",
        });
      }
      return resolve({
        statusCode: "0",
        success: true,
        message: "House-Plan Data retrived successfully!",
        Profile: plan,
      });
    } catch (error) {
      logger.error(`${userId}-Internal server error`, error);
      return reject({
        statusCode: "2",
        success: false,
        message: "An error occurred",
        error: error.message,
      });
    }
  });
};

exports.getAll = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const houseplan = await houseBuyingPlanDao.getPlanById(userId);

      if (!houseplan || houseplan.length === 0) {
        return reject({
          statusCode: "1",
          message: "house plan data not found",
        });
      }

      // Successfully retrieve data
      return resolve({
        statusCode: "0",
        success: true,
        message: "houseplan Data retrieved successfully!",
        data: houseplan,
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

exports.update = (houseId, houseData) => {
  return new Promise(async (resolve, reject) => {
    try {
      const {
        userId,
        plannedYear,
        estimatedCost,
        purchasingMode,
        inflationRate,
        expectedReturn,
        currentSavings,
        loanPercentage,
        loanTenure,
        downpayment,
      } = houseData;
      // Check if the user exists
      const user = await emailDao.findUserById(userId);
      if (!user) {
        return reject({
          statusCode: "1",
          success: false,
          message: "User not found!",
        });
      }

      // Future cost calculation using inflation rate
      const yearlyRate = inflationRate / 100;
      const futureCost = Math.round(
        estimatedCost * Math.pow(1 + yearlyRate, plannedYear)
      );

      let houseDataToUpdate = {};
      let responseMessage = "";

      if (purchasingMode === true) {
        // Loan Mode Calculations
        if (
          loanTenure === undefined ||
          downpayment === undefined ||
          loanPercentage === undefined
        ) {
          return reject({
            statusCode: "3",
            success: false,
            message: "Missing required fields for Loan Mode!",
          });
        }
        const monthlyRate = expectedReturn / 100 / 12;
        const totalMonths = plannedYear * 12;
        const monthlySip =
          downpayment > 0
            ? (downpayment * monthlyRate) /
            ((Math.pow(1 + monthlyRate, totalMonths) - 1) * (1 + monthlyRate))
            : 0;
        const investmentAmount = monthlySip * totalMonths;
        const futureValue =
          monthlySip *
          ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) *
          (1 + monthlyRate);

        const returnsRate = futureValue - investmentAmount;
        const targetedAmount = Math.round(investmentAmount + returnsRate);
        const futureValueSavings = Math.round(
          currentSavings * Math.pow(1 + expectedReturn / 100, plannedYear));
        const totalValue = Math.round(downpayment + futureValueSavings);

        const TargetedFutureValue = Math.round(futureCost - totalValue);
        const monthlyInterestRate = loanPercentage / 100 / 12;
        const totalMonthstenure = loanTenure * 12;

        // EMI calculation using standard formula
        const emi =
          (TargetedFutureValue *
            monthlyInterestRate *
            Math.pow(1 + monthlyInterestRate, totalMonthstenure)) /
          (Math.pow(1 + monthlyInterestRate, totalMonthstenure) - 1);
        const principalAmount = TargetedFutureValue - downpayment;
        const totalAmountPayable = emi * totalMonthstenure;
        const interestAmount = totalAmountPayable - principalAmount;

        houseDataToUpdate = {
          userId,
          plannedYear,
          purchasingMode,
          estimatedCost,
          inflationRate,
          expectedReturn,
          currentSavings,
          loanPercentage,
          loanTenure,
          downpayment,
          futureCost,
          futureValueSavings,
          totalValue,
          TargetedFutureValue,
          monthlySip: Math.round(monthlySip),
          investmentAmount: Math.round(investmentAmount),
          returnsRate: Math.round(returnsRate),
          targetedAmount: Math.round(investmentAmount + returnsRate),
          monthlyEMI: Math.round(emi),
          principalAmount: Math.round(principalAmount),
          interestAmount: Math.round(interestAmount),
          totalAmountPayable: Math.round(totalAmountPayable),
        };

        responseMessage =
          "House-buying-plan Loan method data updated successfully!";
      } else if (purchasingMode === false) {
        const futureValueSavings = Math.round(
          currentSavings * Math.pow(1 + expectedReturn / 100, plannedYear));
        const TargetedFutureValue = futureCost - futureValueSavings;
        const monthlyRate = expectedReturn / 100 / 12;
        const totalMonths = plannedYear * 12;
        const monthlySip =
          TargetedFutureValue > 0
            ? (TargetedFutureValue * monthlyRate) /
            ((Math.pow(1 + monthlyRate, totalMonths) - 1) * (1 + monthlyRate))
            : 0;
        const investmentAmount = monthlySip * totalMonths;
        const futureValue =
          monthlySip *
          ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) *
          (1 + monthlyRate);

        const returnsRate = futureValue - investmentAmount;

        houseDataToUpdate = {
          userId,
          plannedYear,
          estimatedCost,
          inflationRate,
          expectedReturn,
          currentSavings,
          purchasingMode,
          loanTenure:0,
          downpayment:0,
          loanPercentage:0,
          futureCost,
          futureValueSavings,
          TargetedFutureValue,
          monthlySip: Math.round(monthlySip),
          investmentAmount: Math.round(investmentAmount),
          returnsRate: Math.round(returnsRate),
          targetedAmount: Math.round(investmentAmount + returnsRate),
        };

        responseMessage = "Savings via House Buying Plan updated successfully!";
      } else {
        return reject({
          statusCode: "3",
          success: false,
          message: "Invalid purchasing mode or missing required fields!",
        });
      }

      // Update the vehicle data in the database
      const updatedHouse = await houseBuyingPlanDao.updatePlan(
        houseId,
        houseDataToUpdate
      );

      resolve({
        statusCode: "0",
        success: true,
        message: responseMessage,
        data: updatedHouse,
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

exports.delete = async (houseId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const houseplan = await houseBuyingPlanDao.findPlanById(houseId);
      if (!houseplan) {
        return reject({
          statusCode: "1",
          success: false,
          message: "houseplan Data not found!",
        });
      }
      await houseBuyingPlanDao.deletePlanById(houseId);
      return resolve({
        statusCode: "0",
        success: true,
        message: "housePlan Data deleted successfully!",
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
