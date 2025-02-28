const vehicleDao = require("../../Dao/Goal-Tracker/vehicleDao");
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

    const existingData = await vehicleDao.existingData(userId);
    if(existingData){
      return reject({
        statusCode : "1",
        success : false,
        message : "vehicle data already exists.."
      })
    }
      let vehicleData = {};
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

        const futureValueSavings = Math.round (
          currentSavings * Math.pow(1 + expectedReturn /100, plannedYear));
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

        vehicleData = {
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
          futureValueSavings,
          totalValue,
          TargetedFutureValue,
          monthlyEMI: Math.round(emi),
          principalAmount: Math.round(principalAmount),
          interestAmount: Math.round(interestAmount),
          totalAmountPayable: Math.round(totalAmountPayable),
        };

        responseMessage =
          "Vehicle-buying-plan Loan method data created successfully!";
      } else if (purchasingMode === false) {
        const futureValueSavings = Math.round (
          currentSavings * Math.pow(1 + expectedReturn /100, plannedYear));
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

        vehicleData = {
          userId,
          plannedYear,
          estimatedCost,
          inflationRate,
          expectedReturn,
          currentSavings,
          purchasingMode,
          loanPercentage:0,
          loanTenure:0,
          downpayment:0,
          futureCost,
          futureValueSavings,
          TargetedFutureValue,
          monthlySip: Math.round(monthlySip),
          investmentAmount: Math.round(investmentAmount),
          returnsRate: Math.round(returnsRate),
          targetedAmount: Math.round(investmentAmount + returnsRate),
        };

        responseMessage =
          "Savings via Vehicle Buying Plan created successfully!";
      } else {
        return reject({
          statusCode: "3",
          success: false,
          message: "Invalid purchasing mode or missing required fields!",
        });
      }

      // Save vehicle data to the database
      const vehicleDataDetails = await vehicleDao.createVehicle(vehicleData);
      resolve({
        statusCode: "0",
        success: true,
        message: responseMessage,
        data: [vehicleDataDetails],
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
      const vehicle = await vehicleDao.getVehicleById(userId);

      if (!vehicle || vehicle.length === 0) {
        return reject({
          statusCode: "1",
          message: "Vehicles plan data not found",
        });
      }

      // Successfully retrieve data
      return resolve({
        statusCode: "0",
        success: true,
        message: "vehicles Data retrieved successfully!",
        data: vehicle,
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

exports.update = (vehicleId, vehicleData) => {
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
      } = vehicleData;

      // // Validate required input fields
      // if (!userId || !plannedYear || !estimatedCost || purchasingMode === undefined) {
      //   return reject({
      //     statusCode: "1",
      //     success: false,
      //     message: "Missing required fields in the input data!",
      //   });
      // }

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

      let vehicleDataToUpdate = {};
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

        const futureValueSavings = Math.round (
          currentSavings * Math.pow(1 + expectedReturn /100, plannedYear));

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

        // Build updated data for loan mode
        vehicleDataToUpdate = {
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
          "Vehicle-buying-plan Loan method data updated successfully!";
      } else if (purchasingMode === false) {
        const futureValueSavings = Math.round (
          currentSavings * Math.pow(1 + expectedReturn /100, plannedYear));
          
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

        vehicleDataToUpdate = {
          userId,
          plannedYear,
          estimatedCost,
          inflationRate,
          expectedReturn,
          currentSavings,
          purchasingMode,
          loanPercentage:0,
          loanTenure:0,
          downpayment:0,
          futureCost,
          TargetedFutureValue,
          monthlySip: Math.round(monthlySip),
          investmentAmount: Math.round(investmentAmount),
          returnsRate: Math.round(returnsRate),
          targetedAmount: Math.round(investmentAmount + returnsRate),
        };

        responseMessage =
          "Savings via Vehicle Buying Plan updated successfully!";
      } else {
        return reject({
          statusCode: "3",
          success: false,
          message: "Invalid purchasing mode or missing required fields!",
        });
      }

      // Update the vehicle data in the database
      const updatedVehicle = await vehicleDao.updateVehicle(
        vehicleId,
        vehicleDataToUpdate
      );

      resolve({
        statusCode: "0",
        success: true,
        message: responseMessage,
        data: updatedVehicle,
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

exports.delete = async (vehicleId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const vehicle = await vehicleDao.findVehicleById(vehicleId);
      if (!vehicle) {
        return reject({
          statusCode: "1",
          success: false,
          message: "vehicle Data not found!",
        });
      }
      await vehicleDao.deleteVehicleById(vehicleId);
      return resolve({
        statusCode: "0",
        success: true,
        message: "vehicle Data deleted successfully!",
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
