const budgetDao = require("../../Dao/ExpensesAllocation/budgetDao");
const emailDao = require("../../Dao/Login/emailDao");
const ExpensesAllocation = require("../../Models/ExpensesAllocation/allocationModel");

exports.create = (budgetData) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { month, year, userId, income, otherIncome  } = budgetData;

      const user = await emailDao.findUserById(userId);
      if (!user) {
        return reject({ 
          statusCode : "1",
          success : false,
          message : "User not found!" 
        });
      }
      
      const existingBudget = await budgetDao.getBudgetByMonthAndYear(
        userId,
        month,
        year
      );
      if (existingBudget) {
        return reject({
          statusCode : "1",
          success : false,
          message : "Budget entry already exists for this month and year!",
        });
        }
      let otherIncomeValues = null;
      let totalOtherIncome = 0;
      if (Array.isArray(otherIncome)) {
        otherIncomeValues = otherIncome
          .slice(0, 10)
          .concat(Array(10 - otherIncome.length).fill(0));
        totalOtherIncome = otherIncomeValues.reduce(
          (acc, curr) => acc + Number(curr || 0),
          0
        );
      }
      const totalIncome = Number(income || 0) + totalOtherIncome;

      const newBudget = {
        ...budgetData,
        otherIncome: otherIncomeValues,
        totalIncome,
      };

      const createdBudget = await budgetDao.createBudget(newBudget);

      await budgetDao.propagateFutureMonths(createdBudget);

      resolve(createdBudget);
    } catch (error) {
      console.error("Error in budget creation:", error);
      reject(new Error("Failed to create budget: " + error.message));
    }
  });
};

// exports.create = (budgetData) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const { month, year, userId, income, otherIncome = [] } = budgetData;

//       const user = await UserDAO.findUserById(userId);
//       if (!user) {
//         return reject({ error: "User not found" });
//       }

//       const existingBudget = await budgetDao.getBudgetByMonthAndYear(
//         userId,
//         month,
//         year
//       );
//       if (existingBudget) {
//         return reject(
//           new Error("Budget entry already exists for this month and year")
//         );
//       }

//       const otherIncomeValues = otherIncome
//         .slice(0, 10)
//         .concat(Array(10 - otherIncome.length).fill(0));
//       const totalOtherIncome = otherIncomeValues.reduce(
//         (acc, curr) => acc + Number(curr || 0),
//         0
//       );
//       const totalIncome = Number(income || 0) + totalOtherIncome;

//       const newBudget = {
//         ...budgetData,
//         otherIncome: otherIncomeValues,
//         totalIncome,
//       };

//       const createdBudget = await budgetDao.createBudget(newBudget);

//       await budgetDao.propagateFutureMonths(createdBudget);

//       resolve(createdBudget);
//     } catch (error) {
//       console.error("Error in budget creation:", error);
//       reject(new Error("Failed to create budget: " + error.message));
//     }
//   });
// };

exports.updateBudget = (id, budgetData) => {
  return new Promise(async (resolve, reject) => {
    try {
      const existingBudget = await budgetDao.getBudgetById(id);
      if (!existingBudget) {
        return reject(new Error("Budget not found"));
      }

      // Extract otherIncome and income from budgetData, defaulting to empty array or 0
      const otherIncome = budgetData.otherIncome || [];
      const income = budgetData.income || 0;

      // Ensure otherIncome is an array of numbers and calculate total
      const otherIncomeValues = Array.isArray(otherIncome)
        ? otherIncome.map(value => Number(value) || 0)
        : [];
      const totalOtherIncome = otherIncomeValues.reduce(
        (acc, curr) => acc + curr,
        0
      );

      // Calculate total income
      const totalIncome = Number(income) + totalOtherIncome;

      // Update the budget with the calculated total income
      const updatedBudget = await budgetDao.updateBudget(id, {
        ...budgetData,
        totalIncome,
      });

      // Propagate future months if needed
      if (budgetData.propagate) {
        await budgetDao.propagateFutureMonths(updatedBudget);
      }

      resolve(updatedBudget);
    } catch (error) {
      reject(new Error("Failed to update budget: " + error.message));
    }
  });
};


exports.deleteBudget = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const existingBudget = await budgetDao.getBudgetById(id);
      if (!existingBudget) {
        return reject(new Error("Budget not found"));
      }

      await budgetDao.deleteBudget(id);
      resolve({ message: "Budget deleted successfully" });
    } catch (error) {
      reject(new Error("Failed to delete budget: " + error.message));
    }
  });
};

exports.getBudgetById = (budgetId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const budget = await budgetDao.getBudgetById(budgetId);
      if (!budget) {
        return reject({
          statusCode:"1",
          message:"Data Not Found"
        });
      }

      resolve(budget);
    } catch (error) {
      reject(new Error("Failed to retrieve budget: " + error.message));
    }
  });
};

exports.View = ({ month, year, userId }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const budget = await budgetDao.getBudgetByMonthAndYear(
        userId,
        month,
        year
      );

      if (!budget) {
        return reject({
          statusCode:"1",
          message:"Budget not found for the specified month, year, and user"})
      }

      resolve(budget);
    } catch (error) {
      reject(new Error("Failed to retrieve budget: " + error.message));
    }
  });
};

exports.calculateBudget = (month, year, userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const budget = await budgetDao.getBudgetByMonthAndYear(userId, month, year);
      if (!budget) {
        return reject({
          statusCode:"1",
          message:"No budget found for the selected month and year"});
      }

      const expensesAllocation = await ExpensesAllocation.getExpensesAllocation(userId, month, year);
      if (!expensesAllocation) {
        return reject({
          statusCode:"1",
          message:"No expenses allocation found for the selected month and year"});
      }

      const totalIncome = budget.totalIncome;
      const totalExpenses = expensesAllocation.totalExpenses;
      const remainingBalance = totalIncome - totalExpenses;

      resolve({ totalIncome, totalExpenses, remainingBalance });
    } catch (error) {
      reject(new Error("Failed to calculate budget: " + error.message));
    }
  });
};
