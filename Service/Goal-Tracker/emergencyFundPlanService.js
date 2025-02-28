const emergencyfundplanDao = require('../../Dao/Goal-Tracker/emergencyFundPlanDao');

exports.createEmergencyFundPlan = async (postData) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { userId, monthlyExpense, expenseTotalMonth, savingPeriodOfMonth, returnRate } = postData
            const user = await emergencyfundplanDao.findUserById(userId)
            if (!user) {
                return reject({ error: "User not found" });
            }
            const finalMonthlyExpense = monthlyExpense * expenseTotalMonth
            console.log("final", finalMonthlyExpense)

            const annualRate = returnRate / 100 / 12
            
            const denominator = ((Math.pow(1 + annualRate, savingPeriodOfMonth) - 1) / annualRate) * (1 + annualRate);
            console.log("??", denominator)

       
            const monthlySavings = finalMonthlyExpense / denominator;
            const monthlySIP = Number(Number(monthlySavings).toFixed(0))

            const totalInvestAmount = parseFloat(monthlySIP) * parseFloat(savingPeriodOfMonth)
            console.log("??/", totalInvestAmount)
            
            const estimatedReturn = finalMonthlyExpense - totalInvestAmount
            console.log("?????", estimatedReturn)

            const emergencyFundPlan = {
                userId: user._id,
                monthlyExpense,
                expenseTotalMonth,
                totalExpenses:Number(Number(finalMonthlyExpense).toFixed(0)),
                savingPeriodOfMonth,
                returnRate,
                monthlySipAmount: Number(Number(monthlySIP).toFixed(0)),
                investedAmount:Number(Number(totalInvestAmount).toFixed(0)),
                estimatedReturn:Number(Number(estimatedReturn).toFixed(0))
            }
            const emergencyFundPlanDetails = await emergencyfundplanDao.createEmergencyFunPlan(emergencyFundPlan)
            resolve({
                statusCode: "0",
                message: "Emergency Fund Plan created successfully",
                data: emergencyFundPlanDetails,
                
                
            })
        } catch (error) {
            reject({
                statusCode: "1",
                message: "An error occurred",
                error: error.message,
            });
        }
    })

}


exports.getAll = async (userId) => {
   
    try {
        const user = await emergencyfundplanDao.findUserById(userId);

        if (!user) {
           
            return { statusCode: "1", message: "User not found" };
        }

        const expenses = await emergencyfundplanDao.findAllByUserId(userId);
       

        if (!expenses || expenses.length === 0) {
            return {
                statusCode: "1",
                data: [],
                message: "No EmergencyFund plans found for the user",
            };
        }

        return { statusCode: "1",message:"All EmergencyFund Plan Fetched Successfully", data: expenses };
    } catch (error) {
        console.error("Service: Error occurred:", error.message); 
        throw new Error(error.message);
    }
};
