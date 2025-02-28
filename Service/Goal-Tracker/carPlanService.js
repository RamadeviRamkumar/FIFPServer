const carDao = require("../../Dao/Goal-Tracker/carPlanDao");
// const logger = require('../../utils/logger')

exports.create = async (postData) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { userId, vehicles } = postData;

      const user = await carDao.findUserById(userId);
      if (!user) {
        logger.error(`${userId}-User Not Found`)
        return reject({
          statusCode: "1",
          message: "User not found",
        });
      }

      const results = [];

      for (const vehicle of vehicles) {
        const {
          carModel,
          estimatedPrice,
          periodOfYear,
          purchasingMode,
          percentageOfDownPayment,
          percentageOfInterest,
          inflationRate,
          espectedReturnRate,
        } = vehicle;

        if (purchasingMode === false) {
          const findCompoundInterest =
            estimatedPrice * Math.pow(1 + inflationRate / 100, periodOfYear);
          const compoundInterest = findCompoundInterest - estimatedPrice;

          const includeCIAmount = estimatedPrice + compoundInterest;

          const annualRate = espectedReturnRate / 100 / 12;
          const totalMonth = periodOfYear * 12;

          const denominator = ((Math.pow(1 + annualRate, totalMonth) - 1) / annualRate) * (1 + annualRate);
          console.log("??", denominator)

         
          const monthlySavings = includeCIAmount / denominator;
          const monthlySIP = Number(Number(monthlySavings).toFixed(0))

          console.log(monthlySIP)

          const totalInvestAmount = parseFloat(monthlySIP) * parseFloat(totalMonth)
          console.log("??/", totalInvestAmount)
          
          const estimatedReturn = includeCIAmount - totalInvestAmount
          console.log("?????", estimatedReturn)

          const carBuyingPlan = {
            userId: user._id,
            carModel,
            estimatedPrice,
            periodOfYear,
            purchasingMode,
            inflationRate,
            espectedReturnRate,
            totalCIAmount: Number(Number(includeCIAmount.toFixed(0))),
            monthlySipAmount: Number(Number(monthlySavings.toFixed(0))),
            investedAmount: Number(Number(totalInvestAmount).toFixed(0)),
            estimatedReturn: Number(Number(estimatedReturn).toFixed(0))
          };

          const carBuyingPlanDetails = await carDao.createCarBuyingPlan(
            carBuyingPlan
          );
          results.push({
            carModel,
            userId: user._id,
            data: carBuyingPlanDetails,
            
          });
        } else {
          // Loan Calculation
          const findDownPayment =
            (estimatedPrice * percentageOfDownPayment) / 100;
          const loanAmountAfterDownPayment = estimatedPrice - findDownPayment;

          const monthlyInterestRate = percentageOfInterest / 12 / 100;
          const tenureMonths = periodOfYear * 12;

          const emi =
            (loanAmountAfterDownPayment *
              monthlyInterestRate *
              Math.pow(1 + monthlyInterestRate, tenureMonths)) /
            (Math.pow(1 + monthlyInterestRate, tenureMonths) - 1);

            const totalPayAmount = emi * tenureMonths

            const findInterestAmount = parseInt(totalPayAmount) - parseInt(loanAmountAfterDownPayment)

          const loanBasedCarBuyingPlan = {
            userId: user._id,
            carModel,
            estimatedPrice,
            periodOfYear,
            purchasingMode,
            percentageOfDownPayment,
            percentageOfInterest,
            emiAmount: Number(emi.toFixed(0)),
            principalAmount:Number(Number(loanAmountAfterDownPayment).toFixed(0)),
            interestAmount:Number(Number(findInterestAmount).toFixed(0)),
            totalAmountPayable:(Number(Number(totalPayAmount).toFixed(0)))

          };

          const loanBasedCarBuyingPlanDetails =
            await carDao.createCarBuyingPlan(loanBasedCarBuyingPlan);
          results.push({
            carModel,
            userId: user._id,
            data: loanBasedCarBuyingPlanDetails,
          });
        }
      }

      resolve({
        statusCode: "0",
        message: "CarBuyingPlan created successfully",
        results,
      });
      logger.info(`${userId}-Car Buying Plan Created Successfully`)
    } catch (error) {
      reject({
        statusCode: "1",
        message: "An error occurred",
        error: error.message,
      });
    }
  });
};

exports.getAll = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await carDao.findUserCarById(userId);

      if (!user || user.length === 0) {
        logger.info(`${userId}- No Car Buying Plan Found `)
        return resolve({
          statusCode: 200,
          data: [],
          message: "No CarBuying plans found for the user",
        });
      }
  const carPlanDetails = await carDao.findAllByUserId(userId)
      resolve({
        statusCode: 201,
        message: "All CarBuying Plan Fetched Successfully",
        data: carPlanDetails,
      });
      logger.info(`${userId}-Car Buying Plan Fetched Successfully `)
    } catch (error) {
      console.error("Service: Error occurred:", error.message);
      reject({
        statusCode: 500,
        message: "Internal Server Error",
        error: error.message,
      });
    }
  });
};
