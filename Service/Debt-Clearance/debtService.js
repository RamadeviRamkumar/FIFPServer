const debtDao = require("../../Dao/Debt-Clearance/debtDao");
const moment = require("moment-timezone");
// const logger = require("../../utils/logger");

exports.createDebt = async (userId, source) => {
  try {
    const currentDateTime = moment.tz("Asia/Kolkata");
    const currentDate = currentDateTime.format("YYYY-MM-DD");
    const currentTime = currentDateTime.format("HH:mm:ss");

    let enrichedSource = source.map((loan) => {
      if (!loan.startDate) {
        throw new Error("Start date is required for each loan");
      }

      const monthlyInterestRate = loan.interest / 100 / 12;
      const totalMonths = loan.loanTenure * 12;
      const emi =
        (loan.principalAmount *
          monthlyInterestRate *
          Math.pow(1 + monthlyInterestRate, totalMonths)) /
        (Math.pow(1 + monthlyInterestRate, totalMonths) - 1);

      const totalPayment = emi * totalMonths;
      const totalInterestPayment = totalPayment - loan.principalAmount;
      const outstandingBalance = loan.principalAmount - loan.currentPaid;

      const startDate = moment(loan.startDate, "YYYY-MM-DD");
      const paidOffDate = startDate
        .clone()
        .add(totalMonths, "months")
        .format("YYYY-MM-DD");

      return {
        ...loan,
        emi: Math.round(emi),
        totalPayment: Math.round(totalPayment),
        totalInterestPayment: Math.round(totalInterestPayment),
        outstandingBalance: Math.round(outstandingBalance),
        date: currentDate,
        time: currentTime,
        paymentHistory: [],
        paidOffDate,
      };
    });

    const debtFreeYear = enrichedSource.length
      ? Math.max(
          ...enrichedSource.map((loan) =>
            new Date(loan.paidOffDate).getFullYear()
          )
        )
      : null;

    const updatedDebt = await debtDao.upsertDebt(userId, enrichedSource);
    if (!updatedDebt) {
      throw new Error("Debt update failed");
    }

    return {
      ...updatedDebt,
      debtFreeYear,
    };
  } catch (error) {
    console.error("Error in createDebt:", error);
    return {
      statusCode: "2",
      message: "Internal Server Error",
    };
  }
};

// exports.payEMI = async (userId, loanId, emiPaid) => {
//   const debt = await debtDao.getDebtByUserId(userId);
//   if (!debt) {
//     logger.error(`${userId}-Debt record not found`);
//     throw new Error("Debt record not found.");
//   }

//   const loan = debt.source.find((loan) => loan._id.toString() === loanId);
//   if (!loan) {
//     throw new Error("Loan not found.");
//   }

//   const monthlyInterestRate = loan.interest / 100 / 12;
//   const interestForTheMonth = loan.outstandingBalance * monthlyInterestRate;

//   if (emiPaid < interestForTheMonth) {
//     throw new Error("EMI is too low to cover interest.");
//   }

//   const principalPaid = emiPaid - interestForTheMonth;

//   loan.currentPaid += emiPaid;
//   const currentDateTime = moment.tz("Asia/Kolkata");
//   const currentMonth = currentDateTime.format("YYYY-MM");

//   loan.paymentHistory.push({
//     month: currentMonth,
//     emiPaid,
//     principalPaid: Math.round(principalPaid),
//     interestPaid: Math.round(interestForTheMonth),
//     remainingBalance: Math.round(loan.outstandingBalance),
//   });

//   loan.outstandingBalance = Math.round(loan.outstandingBalance - principalPaid);

//   await debt.save();
//   // logger.info(`${userId}-EMI payment recorded successfully.`);
//   return {
//     message: "EMI payment recorded successfully.",
//     data: {
//       loanId: loan._id,
//       emiPaid,
//       interestPaid: Math.round(interestForTheMonth),
//       principalPaid: Math.round(principalPaid),
//       currentPaid: loan.currentPaid,
//       outstandingBalance: Math.round(loan.outstandingBalance),
//     },
//   };
// };
exports.payEMI = async (userId, loanId, emiPaid) => {
  try {
    const debt = await debtDao.getDebtByUserId(userId);
    if (!debt) {
      logger.error(`${userId}-Debt record not found`);
      throw new Error("Debt record not found.");
    }

    const loan = debt.source.find((loan) => loan._id.toString() === loanId);
    if (!loan) {
      throw new Error("Loan not found.");
    }

    const monthlyInterestRate = loan.interest / 100 / 12;
    let outstandingBalance = loan.outstandingBalance;
    let currentPaid = 0;
    const startDate = moment(loan.startDate, "YYYY-MM-DD");
    const totalMonths = loan.loanTenure * 12;

    // Ensure paymentHistory exists
    if (!loan.paymentHistory) {
      loan.paymentHistory = [];
    }

    const paymentSchedule = [];

    for (let i = 0; i < totalMonths; i++) {
      const monthDate = startDate.clone().add(i, "months");
      const interestForTheMonth = Math.round(outstandingBalance * monthlyInterestRate);

      if (emiPaid < interestForTheMonth) {
        throw new Error("EMI is too low to cover interest.");
      }

      const principalPaid = emiPaid - interestForTheMonth;
      currentPaid += emiPaid;
      outstandingBalance = Math.max(0, outstandingBalance - principalPaid);

      const paymentEntry = {
        month: monthDate.format("MM/YYYY"),
        emiPaid,
        interestPaid: interestForTheMonth,
        principalPaid,
        currentPaid,
        outstandingBalance,
      };

      loan.paymentHistory.push(paymentEntry);
      paymentSchedule.push(paymentEntry);

      if (outstandingBalance <= 0) break;
    }

    // Save the updated debt
    await debt.save(); 

    return {
      message: "EMI payment recorded successfully.",
      data: paymentSchedule,
    };
  } catch (error) {
    console.error("Error in payEMI:", error.message);
    return { message: "Internal Server Error", error: error.message };
  }
};


exports.getAllDebts = async (userId) => {
  const debt = await debtDao.getDebtByUserId(userId);
  if (!debt) {
    return {
      statusCode: "1",
      message: "No debt clearance records found for the user.",
    };
  }

  let totalDebt = 0,
    totalInterest = 0,
    totalPaid = 0,
    totalOwed = 0;
  totalEmi = 0;

  debt.source.forEach((loan) => {
    totalDebt += loan.principalAmount;
    totalEmi += loan.emi;
    totalInterest += loan.totalInterestPayment;
    totalPaid += loan.currentPaid;
    totalOwed += loan.totalPayment - loan.currentPaid;

    let currentBalance = loan.principalAmount;
    loan.paymentHistory.forEach((payment) => {
      currentBalance -= payment.principalPaid;
      payment.remainingBalance = Math.max(0, currentBalance);
    });
  });
  logger.info(`${userId}-Debt clearance records fetched successfully.`);
  return {
    statusCode: "0",
    message: "Debt clearance records fetched successfully.",
    userId: debt.userId,
    debtId: debt._id,
    data: [
      {
        source: debt.source,
        summary: {
          TotalEmi: Math.round(totalEmi),
          TotalDebt: Math.round(totalDebt),
          TotalInterest: Math.round(totalInterest),
          TotalPaid: Math.round(totalPaid),
          TotalOwed: Math.round(totalOwed),
        },
      },
    ],
  };
};

// const debtDao = require("../../Dao/Debt-Clearance/debtDao");
// const moment = require("moment-timezone");
// const logger = require("../../utils/logger");

// // Function to calculate Snowball Payments with month-wise breakdown
// const calculateSnowballPayments = (debt, extraPayment) => {
//   let sortedLoans = [...debt.source].sort((a, b) => a.outstandingBalance - b.outstandingBalance);
//   let remainingExtraPayment = extraPayment;
//   let snowballSchedule = [];
//   let currentDate = moment();

//   sortedLoans.forEach((loan) => {
//     while (remainingExtraPayment > 0 && loan.outstandingBalance > 0) {
//       let payment = Math.min(loan.outstandingBalance, remainingExtraPayment);
//       loan.currentPaid += payment;
//       loan.outstandingBalance -= payment;
//       remainingExtraPayment -= payment;

//       snowballSchedule.push({
//         month: currentDate.format("YYYY-MM"),
//         snowball: payment,
//         loanName: loan.loanName,
//         TotalDebt: loan.outstandingBalance,
//       });

//       loan.paymentHistory.push({
//         date: currentDate.format("YYYY-MM-DD"),
//         extraPayment: payment,
//         remainingBalance: loan.outstandingBalance,
//       });

//       currentDate.add(1, "months");
//     }
//   });

//   return { sortedLoans, snowballSchedule };
// };

// // Function to fetch all debts and apply Snowball Method if extraPayment is provided
// exports.getAllDebts = async (userId, extraPayment = 0) => {
//   const debt = await debtDao.getDebtByUserId(userId);
//   if (!debt) {
//     return {
//       statusCode: "1",
//       message: "No debt clearance records found for the user.",
//     };
//   }

//   let totalDebt = 0,
//     totalInterest = 0,
//     totalPaid = 0,
//     totalOwed = 0,
//     totalEmi = 0,
//     originalDebtFreeYear = 0,
//     newDebtFreeYear = 0;

//   debt.source.forEach((loan) => {
//     totalDebt += loan.principalAmount;
//     totalEmi += loan.emi;
//     totalInterest += loan.totalInterestPayment;
//     totalPaid += loan.currentPaid;
//     totalOwed += loan.totalPayment - loan.currentPaid;
//   });

//   originalDebtFreeYear = Math.max(
//     ...debt.source.map((loan) => new Date(loan.paidOffDate).getFullYear())
//   );

//   let snowballSchedule = [];
//   if (extraPayment > 0) {
//     let result = calculateSnowballPayments(debt, extraPayment);
//     debt.source = result.sortedLoans;
//     snowballSchedule = result.snowballSchedule;
//   }

//   newDebtFreeYear = Math.max(
//     ...debt.source.map((loan) => new Date(loan.paidOffDate).getFullYear())
//   );

//   logger.info(`${userId}-Debt clearance records fetched successfully.`);
//   return {
//     statusCode: "0",
//     message: "Debt clearance records fetched successfully.",
//     userId: debt.userId,
//     debtId: debt._id,
//     data: [
//       {
//         source: debt.source,
//         summary: {
//           TotalEmi: Math.round(totalEmi),
//           TotalDebt: Math.round(totalDebt),
//           TotalInterest: Math.round(totalInterest),
//           TotalPaid: Math.round(totalPaid),
//           TotalOwed: Math.round(totalOwed),
//           OriginalDebtFreeYear: originalDebtFreeYear,
//           NewDebtFreeYear: extraPayment > 0 ? newDebtFreeYear : originalDebtFreeYear,
//         },
//         snowballSchedule,
//         snowballApplied: extraPayment > 0 ? true : false,
//       },
//     ],
//   };
// };

// // Function to create debt
// exports.createDebt = async (userId, source) => {
//   const currentDateTime = moment.tz("Asia/Kolkata");
//   const currentDate = currentDateTime.format("YYYY-MM-DD");
//   const currentTime = currentDateTime.format("HH:mm:ss");

//   let enrichedSource = source.map((loan) => {
//     if (!loan.startDate) {
//       throw {
//         statusCode: "1",
//         message: "Start date is required for each loan",
//       };
//     }

//     const monthlyInterestRate = loan.interest / 100 / 12;
//     const totalMonths = loan.loanTenure * 12;

//     const emi =
//       (loan.principalAmount *
//         monthlyInterestRate *
//         Math.pow(1 + monthlyInterestRate, totalMonths)) /
//       (Math.pow(1 + monthlyInterestRate, totalMonths) - 1);

//     const totalPayment = emi * totalMonths;
//     const totalInterestPayment = totalPayment - loan.principalAmount;
//     const outstandingBalance = loan.principalAmount - loan.currentPaid;

//     const startDate = moment(loan.startDate, "YYYY-MM-DD");
//     const paidOffDate = startDate
//       .clone()
//       .add(totalMonths, "months")
//       .format("YYYY-MM-DD");

//     return {
//       ...loan,
//       emi: Math.round(emi),
//       totalPayment: Math.round(totalPayment),
//       totalInterestPayment: Math.round(totalInterestPayment),
//       outstandingBalance: Math.round(outstandingBalance),
//       date: currentDate,
//       time: currentTime,
//       paymentHistory: [],
//       paidOffDate,
//     };
//   });

//   // Determine Debt-Free Year
//   const debtFreeYear = Math.max(
//     ...enrichedSource.map((loan) => new Date(loan.paidOffDate).getFullYear())
//   );

//   const updatedDebt = await debtDao.upsertDebt(userId, enrichedSource);

//   return {
//     ...updatedDebt,
//     debtFreeYear,
//   };
// };

// // Function to fetch all debts and apply Snowball Method if extraPayment is provided
// exports.getAllDebts = async (userId, extraPayment = 0) => {
//   const debt = await debtDao.getDebtByUserId(userId);
//   if (!debt) {
//     return {
//       statusCode: "1",
//       message: "No debt clearance records found for the user.",
//     };
//   }

//   let totalDebt = 0,
//     totalInterest = 0,
//     totalPaid = 0,
//     totalOwed = 0,
//     totalEmi = 0;

//   debt.source.forEach((loan) => {
//     totalDebt += loan.principalAmount;
//     totalEmi += loan.emi;
//     totalInterest += loan.totalInterestPayment;
//     totalPaid += loan.currentPaid;
//     totalOwed += loan.totalPayment - loan.currentPaid;
//   });

//   // Apply Snowball Method if extra payment is provided
//   if (extraPayment > 0) {
//     debt.source = calculateSnowballPayments(debt, extraPayment);
//   }

//   logger.info(`${userId}-Debt clearance records fetched successfully.`);
//   return {
//     statusCode: "0",
//     message: "Debt clearance records fetched successfully.",
//     userId: debt.userId,
//     debtId: debt._id,
//     data: [
//       {
//         source: debt.source,
//         summary: {
//           TotalEmi: Math.round(totalEmi),
//           TotalDebt: Math.round(totalDebt),
//           TotalInterest: Math.round(totalInterest),
//           TotalPaid: Math.round(totalPaid),
//           TotalOwed: Math.round(totalOwed),
//         },
//         snowballApplied: extraPayment > 0 ? true : false,
//       },
//     ],
//   };
// };

exports.getSnowball = async (userId, initialSnowBall) => {
  // Fetch user debts
  const debt = await debtDao.getDebtByUserId(userId);

  if (!debt || !debt.source || debt.source.length === 0) {
    return {
      statusCode: "1",
      message: "No debt clearance records found for the user.",
    };
  }

  let remainingSnowball = parseFloat(initialSnowBall); // Convert input to number
  let updatedLoans = [...debt.source];

  // Sort loans by the lowest principal amount first (Snowball Method)
  updatedLoans.sort((a, b) => a.principalAmount - b.principalAmount);

  let yearWiseDetails = {}; // Store calculations year-wise

  // Process the Snowball payments
  updatedLoans.forEach((loan) => {
    let startYear = new Date(loan.startDate).getFullYear();
    let outstandingBalance = loan.principalAmount - loan.currentPaid;

    if (!yearWiseDetails[startYear]) {
      yearWiseDetails[startYear] = {
        totalPaid: 0,
        totalInterestPaid: 0,
        remainingBalance: 0,
      };
    }

    if (remainingSnowball > 0) {
      let payment = Math.min(remainingSnowball, outstandingBalance); // Pay as much as possible
      loan.currentPaid += payment;
      remainingSnowball -= payment;
      outstandingBalance -= payment;
    }

    yearWiseDetails[startYear].totalPaid += loan.currentPaid;
    yearWiseDetails[startYear].totalInterestPaid += loan.totalInterestPayment;
    yearWiseDetails[startYear].remainingBalance += outstandingBalance;
  });

  // Update database with new paid amounts
  await debtDao.upsertDebt(userId, updatedLoans);

  return {
    statusCode: "0",
    message: "Snowball payment processed successfully.",
    initialSnowBall,
    debtFreeYear: Math.max(...Object.keys(yearWiseDetails)), // Get max year
    yearWiseDetails,
  };
};

// exports.createDebt = async (userId, source) => {
//   const currentDateTime = moment.tz("Asia/Kolkata");
//   const currentDate = currentDateTime.format("YYYY-MM-DD");
//   const currentTime = currentDateTime.format("HH:mm:ss");

//   const enrichedSource = source.map((loan) => {
//     const monthlyInterestRate = loan.interest / 100 / 12;
//     const totalMonths = loan.loanTenure * 12;

//     const emi =
//       (loan.principalAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, totalMonths)) /
//       (Math.pow(1 + monthlyInterestRate, totalMonths) - 1);

//     const totalPayment = emi * totalMonths;
//     const totalInterestPayment = totalPayment - loan.principalAmount;
//     const outstandingBalance = loan.principalAmount - loan.currentPaid;

//     return {
//       ...loan,
//       emi: Math.round(emi),
//       totalPayment: Math.round(totalPayment),
//       totalInterestPayment: Math.round(totalInterestPayment),
//       outstandingBalance: Math.round(outstandingBalance),
//       date: currentDate,
//       time: currentTime,
//       paymentHistory: [],
//     };
//   });

//   return debtDao.upsertDebt(userId, enrichedSource);
// };

// exports.getAllDebts = async (userId) => {
//   const debt = await debtDao.getDebtByUserId(userId);
//   if (!debt || !Array.isArray(debt.source) || debt.source.length === 0) {
//     return {
//       statusCode: "1",
//       message: "No debt clearance records found for the user.",
//     };
//   }

//   let totalDebt = 0,
//     totalInterest = 0,
//     totalPaid = 0,
//     totalOwed = 0,
//     totalEmi = 0;

//   debt.source.forEach((loan) => {
//     if (!loan || typeof loan.principalAmount !== "number") return;

//     totalDebt += loan.principalAmount;
//     totalEmi += loan.emi || 0;
//     totalInterest += loan.totalInterestPayment || 0;
//     totalPaid += loan.currentPaid || 0;
//     totalOwed += (loan.totalPayment || 0) - (loan.currentPaid || 0);

//     let currentBalance = loan.principalAmount;
//     if (Array.isArray(loan.paymentHistory)) {
//       loan.paymentHistory.forEach((payment) => {
//         currentBalance -= payment.principalPaid || 0;
//         payment.remainingBalance = Math.max(0, currentBalance);
//       });
//     }
//   });

//   // Sorting debt source once, then creating copies for Snowball & Avalanche
//   const sortedLoans = [...debt.source].sort((a, b) => a.principalAmount - b.principalAmount);
//   const snowballLoans = [sortedLoans];
//   const avalancheLoans = [sortedLoans].sort((a, b) => (b.interest || 0) - (a.interest || 0));

//   function calculateDebtPayoff(loans) {
//     let remainingExcess = loans.reduce((sum, loan) => sum + (loan.ExcessAmount || 0), 0);

//     let updatedLoans = loans.map((loan) => {
//       let remainingBalance = loan.outstandingBalance || 0;

//       if (remainingExcess > 0) {
//         let payment = Math.min(remainingExcess, remainingBalance);
//         remainingExcess -= payment;
//         remainingBalance -= payment;
//       }

//       return {
//         ...loan,
//         updatedOutstandingBalance: remainingBalance,
//         isPaidOff: remainingBalance === 0,
//       };
//     });

//     const debtFreeYear = Math.max(
//       ...updatedLoans
//         .map((loan) => new Date(loan.paidOffDate).getFullYear())
//         .filter((year) => !isNaN(year))
//     );

//     return { updatedLoans, debtFreeYear };
//   }

//   const snowballResult = calculateDebtPayoff(snowballLoans);
//   const avalancheResult = calculateDebtPayoff(avalancheLoans);

//   logger.info(`${userId} - Debt clearance records fetched successfully.`);

//   return {
//     statusCode: "0",
//     message: "Debt clearance records fetched successfully.",
//     userId: debt.userId,
//     debtId: debt._id,
//     data: [
//       {
//         source: debt.source,
//         summary: {
//           TotalEmi: Math.round(totalEmi),
//           TotalDebt: Math.round(totalDebt),
//           TotalInterest: Math.round(totalInterest),
//           TotalPaid: Math.round(totalPaid),
//           TotalOwed: Math.round(totalOwed),
//         },
//         snowballMethod: {
//           debtFreeYear: snowballResult.debtFreeYear,
//           updatedLoans: snowballResult.updatedLoans,
//         },
//         avalancheMethod: {
//           debtFreeYear: avalancheResult.debtFreeYear,
//           updatedLoans: avalancheResult.updatedLoans,
//         },
//       },
//     ],
//   };
// };
