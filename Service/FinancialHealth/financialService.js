const financialDao = require("../../Dao/FinancialHealth/financialDao");
const emailDao = require("../../Dao/Login/emailDao");

exports.upsert = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const {
        userId,
        financeId,
        income,
        expenses,
        totalSavings,
        investments,
        totalDebtAmount,
        monthlyEMI,
        insurance,
        emergencyFund,
      } = data;

      if (financeId) {
        // Prepare update data
        const updatedData = {
          userId,
          financeId,
          income,
          expenses,
          totalSavings,
          investments,
          totalDebtAmount,
          monthlyEMI,
          insurance,
          emergencyFund,
        };

        // Check if financial data exists
        const finance = await financialDao.findById(financeId);
        if (!finance) {
          return reject({
            statusCode: "1",
            success: false,
            message: "Financial Health Checkup Data not found!",
          });
        }

        // Update existing financial data
        const updateRecord = await financialDao.update(financeId, updatedData);
        return resolve({
          statusCode: "0",
          success: true,
          message: "Financial health checkup data updated successfully!",
          data: updateRecord,
        });
      } else {
        // Prepare new financial data
        const financialData = {
          userId,
          income,
          expenses,
          totalSavings,
          investments,
          totalDebtAmount,
          monthlyEMI,
          insurance,
          emergencyFund,
        };

        // Check if user exists
        const user = await emailDao.findUserById(userId);
        if (!user) {
          return reject({
            statusCode: "1",
            success: false,
            message: "User not found!",
          });
        }

        // Check if financial data already exists for user
        const existingData = await financialDao.existingData(userId);
        if (existingData) {
          return reject({
            statusCode: "1",
            success: false,
            message: "Financial Health Checkup Data already exists!",
          });
        }

        // Create new financial record
        const savedRecord = await financialDao.create(financialData);
        return resolve({
          statusCode: "0",
          success: true,
          message: "Financial health record created successfully!",
          data: savedRecord,
        });
      }
    } catch (error) {
      console.error("Error creating financial record:", error);
      return reject({
        statusCode: "500",
        success: false,
        message: "Internal server error",
      });
    }
  });
};


exports.getUserFinancial = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await emailDao.findUserById(userId);
      if (!user) {
        return reject({
          statusCode: "1",
          message: "User not found",
        });
      }

      const userData = await financialDao.getUserFinancial(userId);
      const date = userData.updatedAt.toLocaleDateString();
      const time = userData.updatedAt.toLocaleTimeString();
      if (!userData) {
        return reject({
          statusCode: "1",
          message: "Financial data not found for this user",
        });
      }

      const {
        income = 0,
        expenses = 0,
        totalSavings = 0,
        totalDebtAmount = 0,
        monthlyEMI = 0,
        emergencyFund = 0,
        insurance = "None",
        investments = [],
      } = userData;

      let savingsRate = 0;
      let savingsScore = { status: "Poor", points: 0 };

      if (income > 0) {
        savingsRate = ((income - expenses) / income) * 100;

        if (savingsRate < 10) {
          savingsScore = { status: "Needs Improvement", points: 25 };
        } else if (savingsRate >= 10 && savingsRate < 20) {
          savingsScore = { status: "Fair", points: 50 };
        } else if (savingsRate >= 20 && savingsRate < 30) {
          savingsScore = { status: "Good", points: 73 };
        } else {
          savingsScore = { status: "Excellent", points: 100 };
        }
      }

      const debtToIncomeRatio = income > 0 ? (monthlyEMI / income) * 100 : 0;
      const debtScore =
        debtToIncomeRatio > 50
          ? { status: "Poor", points: 25 }
          : debtToIncomeRatio >= 30
          ? { status: "Fair", points: 50 }
          : debtToIncomeRatio >= 10
          ? { status: "Good", points: 75 }
          : { status: "Excellent", points: 82 };

      const emergencyMonths = expenses ? emergencyFund / expenses : 0;
      const emergencyFundScore =
        emergencyMonths < 1
          ? { status: "Poor", points: 15 }
          : emergencyMonths < 3
          ? { status: "Needs Improvement", points: 43 }
          : emergencyMonths < 6
          ? { status: "Good", points: 70 }
          : { status: "Excellent", points: 100 };

      const hasHealth = insurance.includes("Health");
      const hasTerms = insurance.includes("Terms");
      const hasBoth = insurance.includes("Both");

      const insuranceScore = hasBoth
        ? { status: "Excellent", points: 100 }
        : hasHealth || hasTerms
        ? { status: "Fair", points: 50 }
        : { status: "Poor", points: 0 };

      const uniqueInvestments = [...new Set(investments)];
      const investmentScore =
        uniqueInvestments.length < 3
          ? { status: "Poor", points: 10 }
          : uniqueInvestments.length === 3
          ? { status: "Fair", points: 50 }
          : { status: "Excellent", points: 100 };

      const finalScore =
        savingsScore.points * 0.3 +
        debtScore.points * 0.2 +
        emergencyFundScore.points * 0.2 +
        insuranceScore.points * 0.15 +
        investmentScore.points * 0.15;

      const overallStatus =
        finalScore >= 81
          ? "Excellent"
          : finalScore >= 61
          ? "Good"
          : finalScore >= 41
          ? "Fair"
          : "Poor";

      const description =
        overallStatus === "Excellent"
          ? "Strong financial position with all metrics in check."
          : overallStatus === "Good"
          ? "Overall solid financial position."
          : overallStatus === "Fair"
          ? "Needs improvement; some metrics are healthy, others need attention."
          : "Financial health is weak; significant attention needed.";

      const improvementRecommendations = [];
      if (savingsScore.points < 50)
        improvementRecommendations.push("Savings Rate");
      if (debtScore.points < 50)
        improvementRecommendations.push("Debt-to-Income Ratio");
      if (emergencyFundScore.points < 50)
        improvementRecommendations.push("Emergency Fund Adequacy");
      if (insuranceScore.points < 50)
        improvementRecommendations.push("Insurance Coverage");
      if (investmentScore.points < 50)
        improvementRecommendations.push("Investment Diversification");

      userData.savingsScore = savingsScore;
      userData.debtScore = debtScore;
      userData.emergencyFundScore = emergencyFundScore;
      userData.insuranceScore = insuranceScore;
      userData.investmentScore = investmentScore;
      userData.finalScore = finalScore;
      userData.overallStatus = overallStatus;
      userData.description = description;

      await userData.save();

      resolve({
        message: "Financial health data retrieved successfully",
        data: {
          date,
          time,
          metrics: [
            {
              metric: "Savings Rate",
              value: savingsRate.toFixed(2),
              status: savingsScore.status,
              points: savingsScore.points,
            },
            {
              metric: "Debt-to-Income Ratio",
              value: debtToIncomeRatio.toFixed(2),
              status: debtScore.status,
              points: debtScore.points,
            },
            {
              metric: "Emergency Fund Adequacy",
              value: emergencyMonths.toFixed(2),
              status: emergencyFundScore.status,
              points: emergencyFundScore.points,
            },
            {
              metric: "Insurance Coverage",
              status: insuranceScore.status,
              points: insuranceScore.points,
            },
            {
              metric: "Investment Diversification",
              status: investmentScore.status,
              points: investmentScore.points,
            },
            {
              metric: "Overall Score",
              value: finalScore.toFixed(2),
              status: overallStatus,
              description,
              recommendation:
                improvementRecommendations.join(", ") ||
                "No improvement needed.",
            },
          ],
        },
      });
    } catch (error) {
      console.error("Error retrieving or updating financial record:", error);
      reject({ error: "Internal server error" });
    }
  });
};
