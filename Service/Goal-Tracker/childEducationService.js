const { child } = require("winston");
const childEducationDao = require("../../Dao/Goal-Tracker/childEducationDao");
const educationModel = require('../../Models/Goal-Tracker/childEducationModel')
const childPdf = require('../../PDF document/childPdf')
// exports.createExpense = async (postData) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const { userId, children } = postData;
//       const user = await childEducationDao.findUserById(userId);
//       if (!user) {
//         return reject({ message: "User not found" });
//       }
//       const results = [];
//       for (const child of children) {
//         const {
//           name,
//           age,
//           country,
//           currentStudy,
//           futureStudy,
//           periodYears,
//           estimatedCost,
//           inflationRate,
//           expectedReturnRate,
//         } = child;

//         const assumeEstimatedCost = estimatedCost;
//         const assumeInflationRare = inflationRate;
//         const period = periodYears;
//         const findcompundIntrest =
//           assumeEstimatedCost * Math.pow(1 + assumeInflationRare / 100, period);
//         const compoundIntrest = findcompundIntrest - assumeEstimatedCost;

//         const a = parseInt(assumeEstimatedCost);
//         const b = parseInt(compoundIntrest);
//         const includeCIamount = a + b;

//         console.log("???", includeCIamount);

//         const annualRate = expectedReturnRate / 100 / 12;
//         const totalMonth = period * 12;

//         console.log(">>>", totalMonth);

//         const denominator =
//           ((Math.pow(1 + annualRate, totalMonth) - 1) / annualRate) *
//           (1 + annualRate);
//         console.log("??", denominator);

//         const monthlySavings = includeCIamount / denominator;
//         const monthlySIP = Number(Number(monthlySavings).toFixed(0));

//         console.log(monthlySIP);

//         const totalInvestAmount =
//           parseFloat(monthlySIP) * parseFloat(totalMonth);
//         console.log("??/", totalInvestAmount);

//         const estimatedReturn = includeCIamount - totalInvestAmount;
//         console.log("?????", estimatedReturn);

//         const childNewExpense = {
//           userId: user._id,
//           name,
//           age,
//           country,
//           currentStudy,
//           futureStudy,
//           periodYears,
//           estimatedCost,
//           inflationRate,
//           expectedReturnRate,
//           totalCIAmount: Number(Number(includeCIamount.toFixed(0))),
//           monthlySipAmount: Number(Number(monthlySIP.toFixed(0))),
//           investedAmount: Number(Number(totalInvestAmount).toFixed(0)),
//           estimatedReturn: Number(Number(estimatedReturn).toFixed(0)),
//         };

//         const childEducationCreatedExpense = await childEducationDao.createExpense(
//           childNewExpense
//         );
//         console.log("childEducationCreatedExpense", childEducationCreatedExpense)
//         results.push({
//           name,
//           userId,
//           data: childEducationCreatedExpense,
//         });
//       }

//       resolve({
//         statusCode: "0",
//         message: "ChildEducationExpense created successfully",
//         results,
//       });
//     } catch (error) {
//       reject({
//         statusCode: "1",
//         message: "An error occurred",
//         error: error.message,
//       });
//     }
//   });
// };

exports.createExpense = (postData) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { userId, childId, firstchild, secondchild, inflationrate, returnrate, current_savings } = postData
      const user = await childEducationDao.findUserById(userId)
      if (!user) {
        return reject({
          statusCode: "1",
          success: false,
          message: "User not found"
        })
      }
      const existChild = await childEducationDao.findChild(userId)
      if (existChild) {
        if (firstchild && !secondchild) {
          const estimateAmount = firstchild[0].education_estimateamount
          const totalDuration = firstchild[0].study_duration - firstchild[0].currentage
          const savingsInterest = parseInt(current_savings * totalDuration * returnrate / 100)

          const compundInterest = estimateAmount * Math.pow(1 + inflationrate / 100, totalDuration)
          const finalCompoundInterest = parseInt(compundInterest)
          const existingSavings = finalCompoundInterest - savingsInterest

          const annualRate = returnrate / 100 / 12;
          const totalMonth = totalDuration * 12;
          const denominator = ((Math.pow(1 + annualRate, totalMonth) - 1) / annualRate) * (1 + annualRate);
          const monthlySavings = existingSavings / denominator;
          const monthlySIP = Number(Number(monthlySavings).toFixed(0));

          const updateData = {
            userId,
            firstchild,
            inflationrate,
            returnrate,
            current_savings,
            firstchild_monthlysiP: monthlySIP,
            firstchildwith_inflationamount: finalCompoundInterest,
            firstchild_totalFutureCost: finalCompoundInterest,
            firstchild_savingsInterest: savingsInterest,
            firstchild_existingSavings: existingSavings,
          }
          const response = await childEducationDao.updateChild(childId, updateData)
          return resolve({
            statusCode: "0",
            success: true,
            message: "Education Plan Updated Successfully",
            data: response
          })

        } else {
          if (!childId) {
            return reject({
              statusCode: "1",
              success: false,
              message: "Already create data this userId.can you update using childId"
            })
          }
          const estimateAmount = firstchild[0].education_estimateamount
          const totalDuration = firstchild[0].study_duration - firstchild[0].currentage
          const savingsInterest = parseInt(current_savings * totalDuration * returnrate / (2 * 100))

          const compundInterest = estimateAmount * Math.pow(1 + inflationrate / 100, totalDuration)
          const finalCompoundInterest = parseInt(compundInterest)
          const existingSavings1 = finalCompoundInterest - savingsInterest

          const annualRate = returnrate / 100 / 12;
          const totalMonth = totalDuration * 12;
          const denominator = ((Math.pow(1 + annualRate, totalMonth) - 1) / annualRate) * (1 + annualRate);
          const monthlySavings = existingSavings1 / denominator;
          // const monthlySIP = Number(Number(monthlySavings).toFixed(0));
          const monthlySIP = isNaN(Number(monthlySavings)) ? 0 : Number(monthlySavings).toFixed(0);

          const estimateAmount2 = secondchild[0].education_estimateamount
          const totalDuration2 = secondchild[0].study_duration - secondchild[0].currentage
          const savingsInterest2 = parseInt(current_savings * totalDuration2 * returnrate / (2 * 100))

          const compundInterest2 = estimateAmount2 * Math.pow(1 + inflationrate / 100, totalDuration2)
          const finalCompoundInterest2 = parseInt(compundInterest2)
          const existingSavings2 = finalCompoundInterest2 - savingsInterest2

          const annualRate2 = returnrate / 100 / 12;
          const totalMonth2 = totalDuration2 * 12;
          const denominator2 = ((Math.pow(1 + annualRate2, totalMonth2) - 1) / annualRate2) * (1 + annualRate2);
          const monthlySavings2 = existingSavings2 / denominator2;
          // const monthlySIP2 = Number(Number(monthlySavings2).toFixed(0));
          const monthlySIP2 = isNaN(Number(monthlySavings2)) ? 0 : Number(monthlySavings2).toFixed(0);

          const updateData = {
            userId,
            firstchild,
            secondchild,
            inflationrate,
            returnrate,
            current_savings,
            firstchild_current_savings: 0,
            secondchild_current_savings: 0,
            firstchildwith_inflationamount: finalCompoundInterest,
            secondchilddwith_inflationamount: finalCompoundInterest2,
            firstchild_totalEstimateAmount: estimateAmount,
            secondchild_totalEstimateAmount: estimateAmount2,
            firstchild_totalFutureCost: finalCompoundInterest,
            secondchild_totalFutureCost: finalCompoundInterest2,
            firstchild_savingsInterest: savingsInterest,
            secondchild_savingsInterest: savingsInterest2,
            firstchild_monthlysiP: monthlySIP,
            secondchild_monthlysip: monthlySIP2,
            firstchild_existingSavings: existingSavings1,
            secondchild_existingSavings: existingSavings2,
          }
          const response = await childEducationDao.updateChild(childId, updateData)
          return resolve({
            statusCode: "0",
            success: true,
            message: "Education Plan Updated Successfully",
            data: response,
          })
        }
      } else {
        if (firstchild && !secondchild) {
          const estimateAmount = firstchild[0].education_estimateamount
          const totalDuration = firstchild[0].study_duration - firstchild[0].currentage
          const savingsInterest = parseInt(current_savings * totalDuration * returnrate / 100)

          const compundInterest = estimateAmount * Math.pow(1 + inflationrate / 100, totalDuration)
          const finalCompoundInterest = parseInt(compundInterest)
          const existingSavings = finalCompoundInterest - savingsInterest

          const annualRate = returnrate / 100 / 12;
          const totalMonth = totalDuration * 12;
          const denominator = ((Math.pow(1 + annualRate, totalMonth) - 1) / annualRate) * (1 + annualRate);
          const monthlySavings = existingSavings / denominator;
          const monthlySIP = Number(Number(monthlySavings).toFixed(0));
          const createData = {
            userId,
            firstchild,
            inflationrate,
            returnrate,
            current_savings,
            firstchild_monthlysiP: monthlySIP,
            firstchildwith_inflationamount: finalCompoundInterest,
            firstchild_totalFutureCost: finalCompoundInterest,
            firstchild_savingsInterest: savingsInterest,
            firstchild_existingSavings: existingSavings,
          }
          const response = await childEducationDao.createChild(createData)
          await response.save()
          return resolve({
            statusCode: "0",
            success: true,
            message: "Education Plan Created Successfully",
            data: response,
          })

        } else {
          console.log("secondchild")
          const estimateAmount = firstchild[0].education_estimateamount
          const totalDuration = firstchild[0].study_duration - firstchild[0].currentage
          const savingsInterest = parseInt(current_savings * totalDuration * returnrate / (2 * 100))

          const compundInterest = estimateAmount * Math.pow(1 + inflationrate / 100, totalDuration)
          const finalCompoundInterest = parseInt(compundInterest)
          const existingSavings1 = finalCompoundInterest - savingsInterest

          const annualRate = returnrate / 100 / 12;
          const totalMonth = totalDuration * 12;
          const denominator = ((Math.pow(1 + annualRate, totalMonth) - 1) / annualRate) * (1 + annualRate);
          const monthlySavings = existingSavings1 / denominator;
          // const monthlySIP = Number(Number(monthlySavings).toFixed(0));
          const monthlySIP = isNaN(Number(monthlySavings)) ? 0 : Number(monthlySavings).toFixed(0);

          const estimateAmount2 = secondchild[0].education_estimateamount
          const totalDuration2 = secondchild[0].study_duration - secondchild[0].currentage
          const savingsInterest2 = parseInt(current_savings * totalDuration2 * returnrate / (2 * 100))

          const compundInterest2 = estimateAmount2 * Math.pow(1 + inflationrate / 100, totalDuration2)
          const finalCompoundInterest2 = parseInt(compundInterest2)
          const existingSavings2 = finalCompoundInterest2 - savingsInterest2

          const annualRate2 = returnrate / 100 / 12;
          const totalMonth2 = totalDuration2 * 12;
          const denominator2 = ((Math.pow(1 + annualRate2, totalMonth2) - 1) / annualRate2) * (1 + annualRate2);
          const monthlySavings2 = existingSavings2 / denominator2;
          const monthlySIP2 = isNaN(Number(monthlySavings2)) ? 0 : Number(monthlySavings2).toFixed(0);

          const createData = {
            userId,
            firstchild,
            secondchild,
            inflationrate,
            returnrate,
            current_savings,
            firstchild_current_savings: 0,
            secondchild_current_savings: 0,
            firstchildwith_inflationamount: finalCompoundInterest,
            secondchilddwith_inflationamount: finalCompoundInterest2,
            firstchild_totalEstimateAmount: estimateAmount,
            secondchild_totalEstimateAmount: estimateAmount2,
            firstchild_totalFutureCost: finalCompoundInterest,
            secondchild_totalFutureCost: finalCompoundInterest2,
            firstchild_savingsInterest: savingsInterest,
            secondchild_savingsInterest: savingsInterest2,
            firstchild_monthlysiP: monthlySIP,
            secondchild_monthlysip: monthlySIP2,
            firstchild_existingSavings: existingSavings1,
            secondchild_existingSavings: existingSavings2,
          }
          const response = await childEducationDao.createChild(createData)

          await response.save();
          return resolve({
            statusCode: "0",
            success: true,
            message: "Education Plan Created Successfully",
            data: response,
          })
        }
      }

    } catch (error) {
      return reject({
        statusCode: "2",
        success: false,
        message: `An unexpected error occurred: ${error.message}`,
      });
    }
  });
};

exports.getAll = async (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await childEducationDao.findUserById(userId);

      if (!user) {
        return reject({ statusCode: 200, message: "User not found" });
      }

      const expenses = await childEducationDao.findAllByUserId(userId);

      if (!expenses || expenses.length === 0) {
        return reject({
          statusCode: "1",
          data: [],
          message: "No education plans found for the user",
        });
      }

      return resolve({
        statusCode: 201,
        message: "All ChildEducation Plan Fetched Successfully",
        data: expenses,
      });
    } catch (error) {
      console.error("Service: Error occurred:", error.message);
      throw new Error(error.message);
    }
  })

};

exports.upsert = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { userId, pdfId } = data;
      const checkUserId = await childEducationDao.findUserById(userId)
      if (!checkUserId) {
        return reject({
          statusCode: "1",
          success: true,
          message: "Invalid userId. please check userId"
        })
      }
      const existingPdf = await childEducationDao.findPdf(userId)

      if (existingPdf) {
        if (!pdfId) {
          return reject({
            statusCode: "1",
            success: false,
            message: "pdfId is required!.."
          })
        }
        const existPdf = await childEducationDao.findPdfById(pdfId)
        if (!existPdf) {
          return reject({
            statusCode: "1",
            success: false,
            message: "Data not found given pdfId!..."
          })
        }
        const userName = await childEducationDao.getName(userId);
        const name = `${userName.firstName} ${userName.lastName}`
        const childDetails = await childEducationDao.getData(userId)
        const base64Data = await childPdf.pdfFormat(name, childDetails)
        const updateData = {
          base64Data: base64Data
        }
        const update = await childEducationDao.updatePdf(pdfId, updateData)

        return resolve({
          statusCode: "0",
          success: true,
          message: "Child Education pdf update successfully!...",
          data: update
        })
      } else {
        const userName = await childEducationDao.getName(userId);
        const name = `${userName.firstName} ${userName.lastName}`
        const childDetails = await childEducationDao.getData(userId)
        const base64Data = await childPdf.pdfFormat(name, childDetails)
    
        const create = await childEducationDao.createPdf(userId, base64Data);
        return resolve({
          statusCode: "0",
          success: true,
          message: "Child Education pdf Created successfully!...",
          data: create
        })
      }
    } catch (error) {
      return reject({
        statusCode: "2",
        success: false,
        message: "Internal Server Error",
        error: error.message,
      });
    }
  })
}

exports.getPdf = async (userId) => {
  return new Promise(async (resolve, reject) => {
    try {console.log("object",userId)
      const getBase64 =await childEducationDao.getPdf(userId)
      if (!getBase64 || getBase64.length === 0) {
        return reject({
          statusCode: "1",
          success: true,
          message: "Child Education pdf data not found!..."
        })
      }
      return resolve({
        statusCode: "0",
        success: true,
        message: "Child Education Pdf Data retrieved successfully!",
        data: getBase64
      })
    } catch (error) {
      console.log("object", error)
      return reject({
        statusCode: "2",
        success: false,
        message: "Internal Server Error",
        error: error.message,
      });
    }
  })
}


