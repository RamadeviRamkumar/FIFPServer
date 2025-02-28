const MasterDao = require("../../Dao/Category/MasterDao");
// const logger = require("../../utils/logger");

exports.upsertExpense = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { userId, title, active = true, masterId } = data;

      if (!userId || !title) {
        logger.error(`${userId}-Required fields are missing`);
        return resolve({
          statusCode: "1",
          success: false,
          message: "Required fields are missing!",
        });
      }
      const user = await MasterDao.findUserById(userId);
      if (!user) {
        logger.error(`${userId}-user not found`);
        return reject({
          statusCode: "1",
          success: false,
          message: "User not found!",
        });
      }

      if (masterId) {
        const updatedTitle = await MasterDao.updateExpenseById(masterId, {
          userId,
          title,
          active,
        });
        logger.info(`${userId}-Expense title updated successfully`);
        return resolve({
          statusCode: "0",
          success: true,
          message: "Expense title updated successfully!",
          data: updatedTitle,
        });
      } else {
        const existingTitle = await MasterDao.findExpenseByTitle(userId, title);
        if (existingTitle) {
          logger.error(
            `${userId}-This title already exists. Please try again with a different title.`
          );
          return reject({
            statusCode: "1",
            success: false,
            message:
              "This title already exists. Please try again with a different title!",
          });
        }

        const expenseData = { userId, title, active };

        const newTitle = await MasterDao.createExpense(expenseData);

        const titleData = {
          // userId:newTitle.userId,
          title: newTitle.title,
          active: newTitle.active,
          amount: 0,
        };
        await MasterDao.updateExpenseAllocationTitles(userId, titleData);
        logger.info(`${userId}-Expense title created successfully`);
        return resolve({
          statusCode: "0",
          success: true,
          message: "Expense title created successfully!",
          userId,
          data: titleData,
        });
      }
    } catch (error) {
      logger.error(`${userId}Error in upsertExpense:`, error.message);
      reject({
        statusCode: "2",
        success: false,
        message: error.message || "Failed to create master expenses",
      });
    }
  });
};

exports.getAllExpenses = async (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const expenses = await MasterDao.getMasterFundByUserId(userId);
      // if (!expenses.length) {
        if (!expenses || expenses.length === 0) {
        logger.error(`${userId}-No Expenses found for the provided userId`);
        return reject({
          statusCode: "1",
          success: false,
          message: "No Expenses found for the provided userId!",
        });
      }
      logger.info(`${userId}-Expenses retrieved successfully`);
      return resolve({
        statusCode: "0",
        success: true,
        message: "Expenses retrieved successfully!",
        data: expenses,
      });
    } catch (err) {
      reject({
        statusCode: "2",
        success: false,
        message: err.message || "Internal Server error",
      });
    }
  });
};

exports.getExpenseById = async (masterId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const expense = await MasterDao.findExpenseById(masterId);
      if (!expense) {
        return reject ({
          statusCode : "1",
          success : false,
          message : "Expenses Data not Found!"
        })
      }
        return resolve({
          statusCode: "0",
          success: true,
          message: "Expense data retrieved successfully!",
          data: expense,
        });
    } catch (err) {
      reject({
        statusCode: "2",
        success: false,
        message: err.message || "Internal server error",
      });
    }
  });
};

exports.deleteById = async (masterId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const expense = await MasterDao.findExpenseById(masterId);
      if (!expense) {
        return reject({
          statusCode: "1",
          success: false,
          message: "No expense data found!",
        });
      }

      const previousStatus = expense.active;
      expense.active = !previousStatus;
      await expense.save();

      const allocations = await MasterDao.findAllocationsByTitle(expense.title);
      const allocationPromises = allocations.map(async (allocation) => {
        const titleEntry = allocation.titles.find(
          (title) => title.title === expense.title
        );
        if (titleEntry) {
          if (previousStatus && !expense.active) {
            allocation.totalExpenses -= titleEntry.amount;
            titleEntry.amount = 0;
            titleEntry.category.forEach((i) => (i.amount = 0));
          }
          allocation.totalExpenses = Math.max(0, allocation.totalExpenses);
        }
        return allocation.save();
      });

      await Promise.all(allocationPromises);

      await Promise.all([
        MasterDao.updateChildExpensesStatus(masterId, expense.active),
        MasterDao.updateAllocationTitlesStatus(expense.title, expense.active),
      ]);

      const message = expense.active
        ? "Expense activated successfully"
        : "Expense inactivated successfully";

      return resolve({
        statusCode: "0",
        success: true,
        message,
        data: { parent: expense },
      });
    } catch (error) {
      logger.error(`${userId}-Internal server error`, error);
      return reject({
        statusCode: "2",
        success: false,
        message: error.message || "An error occurred",
      });
    }
  });
};
