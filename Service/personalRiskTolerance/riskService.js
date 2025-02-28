const riskDao = require("../../Dao/PersonalRiskTolerance/riskDao");
const emailDao = require("../../Dao/Login/emailDao");
// const logger = require("../../utils/logger");
const riskProfiles = require("../../config/RiskProfile/riskProfile.json");

const calculateRiskProfile = (totalScore) => {
  const riskProfile = riskProfiles.find(
    (profile) =>
      totalScore >= profile.minScore && totalScore <= profile.maxScore
  );

  if (!riskProfile) {
    return {
      profile: "Unknown Risk Profile",
      riskBasedAssetAllocation: {},
      preReturn: "0%",
    };
  }

  return {
    profile: riskProfile.profile,
    riskBasedAssetAllocation: riskProfile.riskBasedAssetAllocation,
    preReturn: riskProfile.preReturn,
  };
};

exports.createRiskProfile = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { userId, answers, riskId } = data;

      const user = await emailDao.findUserById(userId);
      if (!user) {
        return reject({
          statusCode: "1",
          success: false,
          message: "user not found!",
        });
      }
      if (!answers || !Array.isArray(answers)) {
        return reject({
          statusCode: "1",
          success: false,
          message: "Answers must be provided as an array!",
        });
      }
      if (!answers.every((item) => item && item.answer)) {
        return reject({
          statusCode: "1",
          success: false,
          message: "Each answer must have a valid 'answer' field!",
        });
      }

      let totalScore = 0;
      const processedAnswers = answers.map((item, index) => {
        const points =
          item.answer.toLowerCase() === "a"
            ? 1
            : item.answer.toLowerCase() === "b"
            ? 2
            : item.answer.toLowerCase() === "c"
            ? 3
            : 4;
        totalScore += points;
        return {
          question: index + 1,
          answer: item.answer,
          points,
        };
      });

      const riskProfile = calculateRiskProfile(totalScore);

      const riskData = {
        userId,
        answers: processedAnswers,
        totalScore,
        preReturn: riskProfile.preReturn,
        riskProfile: riskProfile.profile,
        riskBasedAssetAllocation: riskProfile.riskBasedAssetAllocation,
      };

      if (riskId) {
        const existingRisk = await riskDao.findRiskById(riskId);
        if (!existingRisk) {
          return reject({
            statusCode: "1",
            success: false,
            message: "Risk profile not found for the provided riskId",
          });
        }

        const updatedRisk = await riskDao.updateRisk(riskId, riskData);
        
        resolve({
          statusCode: "0",
          success: true,
          message: "Personal Risk Tolerance updated successfully",
          userId,
          riskId,
          data: {
            answers: updatedRisk.answers,
            totalScore: updatedRisk.totalScore,
            preReturn: updatedRisk.preReturn,
            riskProfile: updatedRisk.riskProfile,
            riskBasedAssetAllocation: updatedRisk.riskBasedAssetAllocation,
          },
        });
      } else {
        const newRisk = await riskDao.createRisk(riskData);
        resolve({
          statusCode: "0",
          success: true,
          userId,
          riskId: newRisk._id,
          message: "Personal Risk Tolerance created successfully",
          data: {
            ...newRisk.toObject(),
            preReturn: riskProfile.preReturn,
            riskBasedAssetAllocation: riskProfile.riskBasedAssetAllocation,
          },
        });
      }
    } catch (error) {
      logger.error(`Error in createRiskProfile: ${error.message}`);
      reject({
        statusCode: "2",
        success: false,
        message: "Internal Server Error",
      });
    }
  });
};

exports.getAllRisk = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await riskDao.getUserById(userId);
      const date = await user.updatedAt.toLocaleDateString();
      const time = await user.updatedAt.toLocaleTimeString();
      if (!user || user.length === 0) {
        return reject({
          statusCode: "1",
          success: false,
          message: "User not found or no risk data available!",
        });
      }
      return resolve({
        statusCode: "0",
        success: true,
        message: "Personal Risk Data retrieved successfully!",
        PersonalRisk: user,
        date,
        time
      });
    } catch (error) {
      logger.error(`Error in retrieveData: ${error.message}`);
      reject({
        statusCode: "2",
        success: false,
        message: "Internal Server Error",
      });
    }
  });
};
