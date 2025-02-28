const allocationService = require("../../Service/ExpensesAllocation/allocationService");
// const logger = require('../../utils/logger')

exports.upsert = (req, res) => {
  //#swagger.tags = ['Expenses-Allocation']
  const { userId, titles, month, year } = req.body;
  if ((!userId, !month, !year, !titles)) {
    return res.status(200).json({ error: "All fields are Required" });
  }
  allocationService
    .upsertAllocation(userId, titles, month, year)
    .then((result) => {
      logger.info(`${userId} - Expense Allocation Created Successfully `)
      res.status(201).json(result)})
    .catch((err) => {
      console.error(err);
      logger.error(`${userId} - Expense Allocation Api Internal Server Error`)
      res.status(500).json({
        statuscode: "1",
        message: "Internal Server Error",
      });
    });
};

exports.copyPreviousMonthData = (req, res) => {
  //#swagger.tags = ['Expenses-Allocation']
  const { userId, month, year } = req.body;
  if ((!userId, !month, !year)) {
    return res.status(200).json({ error: "All fields are Required" });
  }
  allocationService
    .copyPreviousMonthData(userId, month, year)
    .then((response) =>{
      logger.info(`${userId} - Allocation Previous Month data copied Successfully `)
       res.status(response.statusCode(201)).json(response)})
    .catch((error) => {
      if(error.statusCode === "1" && error.message === "No allocation data found for the previous month"){
       logger.error(`${userId} - Previous Month No Allocation Data Found `)
        return res.status(200).json({
          statusCode:error.statusCode,
          message:error.message
        })
      }
      console.error(error);
      logger.error(`${userId} - Pervioud Month Allocation Find Api Internal Server Error`)
      res.status(500).json({
        statuscode: "1",
        message: "Internal Server Error",
      });
    });
};

exports.updateExpenseAmount = (req, res) => {
  //#swagger.tags = ['Expenses-Allocation']
  const { userId, entryId, amount } = req.body;
  if ((!userId, !entryId, !amount)) {
    return res.status(200).json({ error: "All fields are required" });
  }
  return allocationService
    .updateExpenseAmount(userId, entryId, amount)
    .then((response) => {
      logger.info(`${userId} - Expense Amount Updated Sucessfully `)
      res.status(response.statusCode(201)).json(response)})
    .catch((err) => {
      console.error(err);
      logger.error(`${userId} - Expense Amount Updated Api Internal Server Error`)
      res.status(500).json({
        statusCode: "1",
        message: "Internal Server Error",
      });
    });
};

exports.postSubCategoryValues = async (req, res) => {
  //#swagger.tags = ['Expenses-Allocation']
  try {
    const response = await allocationService.updateSubCategoryValues(req.body);
    return res.status(response.statusCode === "0" ? 201 : 200).json(response);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      statusCode: "1",
      message: "Internal Server Error",
    });
  }
};

exports.getAll = (req, res) => {
  //#swagger.tags = ['Expenses-Allocation']
  const { userId, month, year } = req.body;
  if ((!userId, !month, !year)) {
    return res.status(200).json({ error: "All fields are Required" });
  }
  allocationService
    .getAll(userId, month, year)
    .then((response) => {
      if(response.statusCode === "1"){
        logger.error(`${userId} - No Allocation Data Found`)
        return res.status(200).json({
          statusCode: "1",
          message: "No allocation data found for the user",
        });
      }
      logger.info(`${userId} - Allocation Data Fetched Sucessfully`)
      res.status(201).json(response);
    })
    .catch((error) => {
      console.error(error);
      logger.error(`${userId} - Allocation Data Get Api Internal Server Error`)
      res.status(500).json({
        statusCode: "1",
        message: "Internal Server Error",
      });
    });
};

exports.getById = (req, res) => {
  //#swagger.tags = ['Expenses-Allocation']
  const { userId, month, year } = req.params;
  if ((!userId, !month, !year)) {
    return res.status(200).json({ error: "All fields are Required" });
  }
  allocationService
    .getAllocationById(userId, month, year)
    .then((result) =>{
      logger.info(`${userId} - Allocation Details Fetched Successfully`)
      res.status(result.statusCode === "0" ? 201 : 200).json(result)
})
    .catch((err) => {
      if(err.statusCode === "1" && err.message === "Expenses Allocation not found"){
       logger.error(`${userId} - Allocation Details Not Available`)
        return res.status(200).json({
          statusCode:err.statusCode,
          message:err.message
        })
      }
      console.error(err);
      logger.error(`${userId}- Allocation Details Get By Id Api Internal server Error`)
      res.status(500).json({
        statusCode: "1",
        message: "Internal Server Error",
      });
    });
};

exports.delete = (req, res) => {
  //#swagger.tags = ['Expenses-Allocation']
  const { allocationId } = req.params;
  if (!allocationId) {
    return res.status(200).json({ error: "allocationId is required" });
  }
  allocationService
    .deleteAllocation(allocationId)
    .then((result) =>{
      res.status(result.statusCode === "0" ? 201 : 200).json(result)
})
    .catch((err) => {
      console.error(err);
      res.status(500).json({
        statusCode: "1",
        message: "Internal Server Error",
      });
    });
};
