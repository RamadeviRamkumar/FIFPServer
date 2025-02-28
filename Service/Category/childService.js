const childExpensesDao = require("../../Dao/Category/childDao");
// const logger = require("../../utils/logger");

exports.upsert = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { userId, expensesId, category } = data;

      if (!userId || !expensesId || !category) {
        return reject({
          statusCode: "1",
          message: "Missing required fields: userId, expensesId, or category",
        });
      }

      const user = await childExpensesDao.findUserById(userId);
      if (!user) {
        logger.error(`${userId}-user not found`);
        return reject({
          statusCode: "1",
          message: "User not found",
        });
      }

      const childExpenses = await childExpensesDao.findExpensesById(expensesId);
      if (!childExpenses) {
        logger.error(`${userId}-Expenses ID does not exist`);
        return reject({
          statusCode: "1",
          message: "Expenses ID does not exist",
        });
      }

      const result = await childExpensesDao.upsertSubCategory(
        expensesId,
        category,
        userId
      );
      logger.info(`${userId}-SubCategory added successfully`);
      return resolve({
        statusCode: "0",
        message: "SubCategory added successfully",
        data: result,
      });
    } catch (error) {
      logger.error(`${userId}-Error in upsert:`, error.message);
      return reject({
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
      const child = await childExpensesDao.getChildById(userId);

      if (!child) {
        logger.error(`${userId}-user not found`);
        return reject({
          statusCode: "1",
          message: "User not found",
        });
      }
      logger.info(`${userId}-Expenses retrieved successfully`);
      return resolve({
        statusCode: "0",
        message: "Expenses retrieved successfully",
        data: child,
      });
    } catch (error) {
      logger.error(`${userId}-Internal server error`, error);
      return reject({
        statusCode: "1",
        message: "An error occurred",
        error: error.message,
      });
    }
  });
};

exports.getChildByMaster = async (userId, title) => {
  try {
    const subData = await childExpensesDao.findChildByMaster(userId, title);
    if (!subData) {
      logger.error(`${userId}-Data not found`);
      return {
        statusCode: "1",
        message: "Data Not Found",
      };
    }
    logger.info(`${userId}-SubCategories data retrieved successfully`);
    return {
      statusCode: 201,
      message: "SubCategories data retrieved successfully",
      data: subData,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.delete = async (id) => {
  try {
    const deletedExpense = await childExpensesDao.deleteById(id);
    if (!deletedExpense) throw new Error("ChildExpenses not found");
    logger.info(`${userId}-ChildExpenses deleted successfully`);
    return {
      statusCode: 200,
      message: "ChildExpenses deleted successfully",
      data: deletedExpense,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.search = (searchTerm) => {
  return new Promise(async (resolve, reject) => {
    try {
      const searchResult = await childExpensesDao.findSearch(searchTerm);

      if (!searchResult || searchResult.length === 0) {
        logger.error(`${userId}-No matching results found`);
        return resolve({
          message: "No matching results found",
          data: [],
          statusCode: "0",
        });
      }
      logger.info(`${userId}-ChildExpenses retrieved successfully`);
      resolve({
        message: "ChildExpenses retrieved successfully",
        data: searchResult.map((expense) => ({
          _id: expense._id,
          expensesId: expense.expensesId,
          category: expense.category.filter((cat) => cat.includes(searchTerm)),
          createdAt: expense.createdAt,
          updatedAt: expense.updatedAt,
        })),
        statusCode: "0",
      });
    } catch (err) {
      logger.error(`${userId}Error in searching child expenses:`, err);
      reject({
        statusCode: "1",
        message: "Internal server error",
      });
    }
  });
};
