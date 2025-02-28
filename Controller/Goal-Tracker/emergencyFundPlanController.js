const regex = require('../../Regex/regex');
const emergencyFundPlanService = require('../../Service/Goal-Tracker/emergencyFundPlanService');
// const logger = require('../../utils/logger')

exports.createPlan = async(req,res)=>{
     //#swagger.tags=['EmergencyFund-Planner']
     const{userId,monthlyExpense,expenseTotalMonth,savingPeriodOfMonth,returnRate}= req.body
     if (!userId ) {
        return res.status(200).json({ message: "UserId Not Valid" });
      }
      if(!regex.onlyNumber.test(monthlyExpense)){
        return res.status(200).json({
            message: "Invalid MonthlyExpense: Only Numbers are allowed.",
            code: "0"
          })
      }
      if(!regex.onlyNumber.test(expenseTotalMonth)){
        return res.status(200).json({
            message: "Invalid ExpenseTotalMonth: Only Numbers are allowed.",
            code: "0"
          })
      }
      if(!regex.onlyNumber.test(savingPeriodOfMonth)){
        return res.status(200).json({
            message: "Invalid SavingPeriodOfMonth: Only Numbers are allowed.",
            code: "0"
          })
      }
      if(!regex.percentage.test(returnRate)){
        return res.status(200).json({
            message: "Invalid ReturnRate: 0 to 100 % only allowed",
            code: "0"
          })
      }
      emergencyFundPlanService.createEmergencyFundPlan(req.body)
      .then((response) => {
        logger.info(`${userId} - Emergency Fund Plan Created Sucessfully`)
        res.status(201).json(response)
      })
      .catch((error) => {
        logger.error(`${userId} - Emergency Fund Plan Created Internal Server Error`)
        res.status(500).json({ message: "Internal Server Error", error })
      })
}

exports.getAll = async(req,res)=>{
  //#swagger.tags=['EmergencyFund-Planner']
  const { userId } = req.query;
   
    if (!userId) {
        return res.status(200).json({
            statusCode: "1",
            message: "Missing required parameter: userId",
        });
    }
    try {
      const result = await emergencyFundPlanService.getAll(userId);
      logger.info(`${userId} - Emergency Fund Plan Get Successfully`)
      res.status(201).json(result);
    } catch (error) {
      if(error.statusCode === "1" && error.message === "No EmergencyFund plans found for the user"){
       logger.error(`${userId} - Emergency Fund Plan Not Available`)
        return res.status(200).json({
          statusCode:error.statusCode,
          message:error.message,
          data:[]
        })
      }
      console.error("Controller: Error in getAllEmergencyFundPlan:", error); 
     logger.error(`${userId} - Emergency Fund Plan Get Api Internal Server Error`)
      res.status(500).json({
          statusCode: "1",
          message: "Failed to retrieve EmergencyFund plans data",
      });
    }
}