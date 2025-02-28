const fireDao = require("../../Dao/FireQuestion/fireDao");
const emailDao = require("../../Dao/Login/emailDao");
const RetirementCalculation = require("../../Service/FireQuestion/calculation");
const { pdfFormat } = require('../../Service/FireQuestion/pdf')


exports.upsert = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const {
        userId,
        fireId,
        age,
        retireage,
        currentExpense,
        inflation,
        monthlysavings,
        retirementsavings,
        prereturn,
        postreturn,
        expectancy,
        startDate,
      } = data;

      // Check if all required fields are present
      if (
        !userId ||
        !age ||
        !retireage ||
        !currentExpense ||
        !inflation ||
        !monthlysavings ||
        !retirementsavings ||
        !prereturn ||
        !postreturn ||
        !expectancy ||
        !startDate
      ) {
        return reject({
          statusCode: "1",
          success: false,
          message: "Check all fields, some data is missing!",
        });
      }

      // Check if user exists
      const user = await emailDao.findUserById(userId);
      if (!user) {
        return reject({
          statusCode: "1",
          success: false,
          message: "User not found!",
        });
      }

      // Perform retirement calculations
      const { results, investmentAchievementPlan, withdrawPlan } =
        RetirementCalculation(data);

      const finalData = {
        ...data,
        results,
        investmentAchievementPlan,
        withdrawPlan,
      };
     
      const existingData = await fireDao.existingData(userId);
      if (!existingData) {

        const fireQuestionData = await fireDao.create(finalData);
        await fireDao.FireQuestionWithCalculation(userId, results);
        await fireDao.updateInvestmentPlan(
          userId,
          investmentAchievementPlan,
          withdrawPlan
        );
       
        resolve({
          statusCode: "0",
          success: true,
          message: "Retirement Data created successfully!",
          fireId,
          data: [
            {
              fireQuestionData,
              RetirementCalculations: [{ results }],
              investmentAchievementPlan,
              withdrawPlan,
            }
          ],
        });
      }
      // update method
      if (fireId) {
        const retire = await fireDao.findRetirementById(fireId);
        if (!retire) {
          return reject({
            statusCode: "1",
            success: false,
            message: "Retirement Data not found!",
          });
        }
        const { results, investmentAchievementPlan, withdrawPlan } =
          RetirementCalculation(data);
        await fireDao.updateRetirementCalculation(fireId, results);
        await fireDao.updateInvestment(
          fireId,
          investmentAchievementPlan,
          withdrawPlan
        );

        const updatedFinalData = {
          ...data,
          ...results,
          ...investmentAchievementPlan,
          ...withdrawPlan,
        };


        const updatedData = await fireDao.update(fireId, updatedFinalData);
        if (!updatedData) {
          return reject({
            statusCode: "1",
            success: false,
            message: "Failed to update data. Please try again.",
          });
        }
        return resolve({
          statusCode: "0",
          success: true,
          message: "Retirement data updated successfully!",
          fireQuestionData: updatedData,
        });
      }

      return reject({
        statusCode: "1",
        success: false,
        message: "Retirement data already exists!",
      });
    } catch (error) {
      return reject({
        statusCode: "2",
        success: false,
        message: `An unexpected error occurred: ${error.message}`,
      });
    }
  });
};

exports.getAll = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const fire = await fireDao.getfireById(userId);

      if (!fire || fire.length === 0) {
        return reject({
          statusCode: "1",
          success: true,
          message: "Retirement data not found",
        });
      }

      // Successfully retrieve data
      return resolve({
        statusCode: "0",
        success: true,
        message: "Retirement Data retrieved successfully!",
        data: fire,
      });
    } catch (error) {
      // Handle any errors that occur during the process
      return reject({
        statusCode: "2",
        success: false,
        message: `An unexpected error occurred: ${error.message}`,
      });
    }
  });
};

exports.pdfGenerate = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const {userId, pdfId } = data
      const user = await fireDao.findByData(userId)
      const userDetails = await fireDao.findUser(userId)
      const userName = `${userDetails.firstName} ${userDetails.lastName}`

      if (!user) {
        return reject({
          statusCode: "1",
          success: false,
          message: "Not found data given Id!...",
        })
      }

      const existingPdf = await fireDao.findPdf(userId)
      if (!existingPdf) {
        const pushData = await pdfFormat(user, userName)
      const createData = {
        userId: userId,
        base64Data: pushData
      }
      const newPdf = await fireDao.createPdf(createData);
      return resolve({
        statusCode: "0",
        success: true,
        message: " pdf create and save successfully",
        data: newPdf
      }) 
      }else{
        if(!pdfId){
          return reject({
            statusCode: "1",
            success: false,
            message: "PDF id is require"
          });
        }
        const pushData = await pdfFormat(user, userName)
        const updateData = {
          userId: userId,
          base64Data: pushData
        }
        const newPdf = await fireDao.updatePdf(pdfId, updateData);
        if(!newPdf){
          return reject({
            statusCode: "1",
            success: false,
            message: "PDF not found given pdf Id"
          });
        }
      return resolve({
        statusCode: "0",
        success: true,
        message: " pdf data updated successfully",
        data: newPdf
      })
      }
    } catch (error) {
      console.log("catch",error)
      return reject({
        statusCode: "2",
        success: false,
        message: `An unexpected error occurred: ${error.message}`,
      });
    }
  })
}

exports.getPdfById = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const getBase64 = await fireDao.findPdf(userId)
      if (!getBase64 || getBase64.length === 0) {
        return reject({
          statusCode: "1",
          success: true,
          message: "Retirement pdf data not found"
        })
      }
      return resolve({
        statusCode: "0",
        success: true,
        message: "Retirement Pdf Data retrieved successfully!",
        data: getBase64
      })

    } catch (error) {
      return reject({
        statusCode: "2",
        success: false,
        message: `An unexpected error occurred: ${error.message}`,
      });
    }
  })
}


