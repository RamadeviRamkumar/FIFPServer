const carService = require("../../Service/Goal-Tracker/carPlanService");
// const logger = require('../../utils/logger');

exports.createPlan = async (req, res) => {
  //#swagger.tags = ['Car-Buying-Planner']
  const { userId, vehicles } = req.body;
  if (
    !userId ||
    !vehicles ||
    !Array.isArray(vehicles) ||
    vehicles.length === 0
  ) {
    logger.error(`${userId}-Vehicled array are required`)
    return res
      .status(200)
      .json({ message: "UserId and Vehicles array are required" });
  }
  for (let vehicle of vehicles) {
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
    // if (
    //   !carModel ||
    //   !estimatedPrice ||
    //   !periodOfYear ||
    //   !purchasingMode ||
    //   !percentageOfDownPayment ||
    //   !percentageOfInterest ||
    //   !inflationRate ||
    //   !espectedReturnRate
    // ) {
    //   return res.status(200).json({ message: "All are Fields are required" });
    // }
  }
  carService
    .create(req.body)
    .then((response) => {
      res.status(201).json(response);
    })
    .catch((error) => {
      logger.error(`${userId}-Internal Sever Error`)
      console.log(error);
      res.status(500).json({ error: "Internal Server error" });
    });
};

exports.getAll = (req, res) => {
  //#swagger.tags = ['Car-Buying-Planner']
  const { userId } = req.query;
  if (!userId) {
    logger.error(`ChildEducation Get All - User Id Is Required`)
    return res.status(200).json({ error: "userId is required" });
  }
  carService
    .getAll(userId)
    .then((response) => {
      res.status(201).json(response);
    })
    .catch((error) => {
      console.log(error);
      logger.error(`${userId}-Internal Server Error`)
      res.status(501).json({ message: "Internal Server Error" });
    });
};
