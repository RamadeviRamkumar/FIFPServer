const allocationDao = require("../../Dao/ExpensesAllocation/allocationDao");
const ExpensesMaster = require("../../Models/Category/masterModel");
const moment = require("moment-timezone");

exports.upsertAllocation = async (userId, titles, month, year) => {
  const user = await allocationDao.findUserById(userId);
  if (!user) {
    return {
      statuscode: "1",
      message: "User not found",
    };
  }

  const existingAllocation = await allocationDao.findExpensesAllocation(
    userId,
    month,
    year
  );
  let updatedTitles = titles || [];

  if (!updatedTitles.length) {
    updatedTitles = await ExpensesMaster.find({ userId })
      .filter((expense) => expense.active)
      .map((expense) => ({
        title: expense.title,
        amount: 0,
        active: expense.active,
        category: expense.category,
      }));

    if (updatedTitles.length === 0) {
      return {
        statuscode: "1",
        message: "No active expenses found for this user",
      };
    }
  }

  const finalTitles = await processTitles(updatedTitles, existingAllocation);

  const totalExpenses = finalTitles.reduce(
    (total, title) =>
      total + (typeof title.amount === "number" ? title.amount : 0),
    0
  );

  const updateData = {
    userId,
    month,
    year,
    titles: finalTitles,
    totalExpenses,
    active: true,
  };

  const updatedAllocation = await allocationDao.upsertExpensesAllocation(
    userId,
    month,
    year,
    updateData
  );

  return {
    statuscode: "0",
    message: existingAllocation
      ? "Expenses Allocation updated successfully"
      : "Expenses Allocation created successfully",
    userId,
    expensesAllocationId: updatedAllocation._id,
    totalExpenses,
    Expenses: finalTitles.map((title) => ({
      title: title.title,
      amount: title.amount,
      active: title.active,
      category: title.category.map((cat) => ({
        title: cat.title,
        amounts: cat.amounts || [],
        _id: cat._id,
      })),
      _id: title._id,
    })),
  };
};

async function processTitles(updatedTitles, existingAllocation) {
  const existingTitlesMap = existingAllocation
    ? new Map(existingAllocation.titles.map((title) => [title.title, title]))
    : new Map();

  updatedTitles.forEach((title) => {
    const existingTitle = existingTitlesMap.get(title.title);
    if (existingTitle) {
      existingTitle.amount = title.amount || 0;
    } else {
      existingTitlesMap.set(title.title, {
        title: title.title,
        amount: title.amount || 0,
        category: title.category || [],
        active: true,
      });
    }
  });

  return Array.from(existingTitlesMap.values());
}

exports.copyPreviousMonthData = async (userId, month, year) => {
  return new Promise(async(resolve,reject)=>{
    try {
      const user = await allocationDao.findUserById(userId);
      if (!user) {
        return reject({ statusCode: "1", message: "User not found" });
      }

      const previousAllocation = await allocationDao.getPreviousMonthAllocation(
        userId,
        month,
        year
      );
      if (!previousAllocation) {
        return reject( {
          statusCode: "1",
          message: "No allocation data found for the previous month",
        });
      }
      const newAllocationData = {
        userId,
        month,
        year,
        titles: previousAllocation.titles.map((title) => ({
          title: title.title,
          category: title.category,
          amount: title.amount,
          active: title.active,
        })),
        totalExpenses: previousAllocation.totalExpenses,
        active: true,
      };
    
      const newAllocation = await allocationDao.createOrUpdateAllocation(
        userId,
        month,
        year,
        newAllocationData
      );
    
      return resolve ({
        statusCode: "0",
        message: "Data copied successfully from the previous month",
        userId,
        expensesAllocationId: newAllocation._id,
        totalExpenses: newAllocation.totalExpenses,
        Expenses: newAllocation.titles,
      });

    } catch (error) {
      return res.status(500).json({message:"Internal Server Error"})
    }
  })
};

exports.updateExpenseAmount = async (userId, entryId, amount) => {
  const expenses = await allocationDao.getExpensesAllocation(userId);
  if (!expenses) {
    return { statusCode: 404, message: "Expenses record not found" };
  }

  const updatedEntry = await allocationDao.updateExpenseAmount(
    expenses,
    entryId,
    amount
  );
  if (!updatedEntry) {
    return { statusCode: 404, message: "Amount entry not found" };
  }

  return {
    statusCode: 200,
    message: "Expense amount updated successfully",
    updatedEntry,
  };
};

// exports.updateSubCategoryValues = async (
//   userId,
//   month,
//   year,
//   selectedMaster,
//   selectedCategory,
//   amount
// ) => {
//   const timeZone = "Asia/Kolkata";
//   const currentDate = moment().tz(timeZone).format("YYYY-MM-DD");
//   const currentTime = moment().tz(timeZone).format("HH:mm:ss");

//   try {
//     const expenses = await allocationDao.findExpensesAllocation(
//       userId,
//       month,
//       year
//     );
//     if (!expenses) {
//       return {
//         statusCode: "1",
//         message: "Expenses record not found for the specified month and year",
//       };
//     }

//     const master = expenses.titles.find(
//       (title) => title.title === selectedMaster
//     );
//     if (!master) {
//       await allocationDao.addNewMaster(
//         expenses,
//         selectedMaster,
//         selectedCategory,
//         amount,
//         currentDate,
//         currentTime
//       );
//     } else {
//       await allocationDao.updateExistingMaster(
//         master,
//         selectedCategory,
//         amount,
//         currentDate,
//         currentTime
//       );
//     }

//     return {
//       statusCode: "0",
//       message: "Subcategory amount updated successfully",
//       category: master.category,
//       categoryTotal: master.category.reduce(
//         (sum, cat) =>
//           sum + cat.amounts.reduce((sumAmt, entry) => sumAmt + entry.amount, 0),
//         0
//       ),
//     };
//   } catch (err) {
//     console.error(err);
//     return { statusCode: "1", message: "Internal Server Error" };
//   }
// };
exports.updateSubCategoryValues = async (data) => {
  const { userId, month, year, selectedMaster, selectedCategory, amount } =
    data;

  const user = await allocationDao.findUserById(userId);
  if (!user) {
    return {
      statusCode: "1",
      message: "User not found",
    };
  }

  const expenses = await allocationDao.findExpensesByDate(userId, month, year);
  if (!expenses) {
    return {
      statusCode: "1",
      message: "Expenses record not found for the specified month and year",
    };
  }

  const master = expenses.titles.find(
    (title) => title.title === selectedMaster
  );
  const timeZone = "Asia/Kolkata";
  const currentDate = moment().tz(timeZone).format("YYYY-MM-DD");
  const currentTime = moment().tz(timeZone).format("HH:mm:ss");

  if (!master) {
    const newMaster = {
      title: selectedMaster,
      active: true,
      category: [
        {
          title: selectedCategory,
          amounts: [
            {
              amount: parseFloat(amount),
              Date: currentDate,
              time: currentTime,
            },
          ],
        },
      ],
    };
    expenses.titles.push(newMaster);
  } else {
    const category = master.category.find(
      (cat) => cat.title === selectedCategory
    );
    if (category) {
      category.amounts.push({
        amount: parseFloat(amount),
        Date: currentDate,
        time: currentTime,
      });
    } else {
      master.category.push({
        title: selectedCategory,
        amounts: [
          {
            amount: parseFloat(amount),
            Date: currentDate,
            time: currentTime,
          },
        ],
      });
    }
  }

  await allocationDao.saveExpenses(expenses);

  const categoryResponse = expenses.titles
    .find((title) => title.title === selectedMaster)
    .category.map((cat) => {
      const totalAmount = cat.amounts.reduce(
        (sum, entry) => sum + entry.amount,
        0
      );
      return {
        title: cat.title,
        amounts: cat.amounts,
        totalAmount: totalAmount,
      };
    });

  const categoryTotal = categoryResponse.reduce(
    (sum, cat) => sum + cat.totalAmount,
    0
  );

  return {
    statusCode: "0",
    message: "Subcategory amount updated successfully",
    category: categoryResponse,
    categoryTotal: categoryTotal,
  };
};

exports.getAll = async (userId, month, year) => {
  return new Promise(async (resolve, reject) => {
    try {
      let allocation = await allocationDao.findExpensesAllocation(
        userId,
        month,
        year
      );

      if (!allocation) {
        const previousAllocation =
          await allocationDao.copyPreviousMonthAllocation(userId);
        if (!previousAllocation) {
          return resolve({
            statusCode: "1",
            message: "No allocation data found for the user",
          });
        }

        const modifiedTitles = previousAllocation.titles.map((title) => ({
          ...title,
          amount: 0,
          category: title.category.map((cat) => ({
            ...cat,
            amounts: [],
            totalAmount: 0,
          })),
        }));

        allocation = new ExpensesAllocation({
          userId,
          month,
          year,
          titles: modifiedTitles,
          AllocationTotal: 0,
          RealityTotal: 0,
        });

        await allocationDao.saveAllocation(allocation);
        return resolve({
          statuscode: "0",
          message:
            "Previous month's data copied with amount reset to 0 for the new month",
          data: [allocation],
        });
      }

      let AllocationTotal = 0;
      let categoryTotal = 0;

      allocation.titles = allocation.titles.map((title) => {
        let individualTitleCatecaoryTotalAmount = 0;

        title.category = title.category.map((cat) => {
          const categoryTotalAmount = cat.amounts.reduce(
            (sum, amt) => sum + amt.amount,
            0
          );
          cat.totalAmount = categoryTotalAmount;
          individualTitleCatecaoryTotalAmount += categoryTotalAmount;
          categoryTotal += categoryTotalAmount;
          return cat;
        });

        AllocationTotal += title.amount;

        return {
          ...title,
          individualTitleCatecaoryTotalAmount,
        };
      });

      allocation.AllocationTotal = AllocationTotal;

      resolve({
        statuscode: "0",
        message: "Data fetched successfully",
        data: [
          allocation,
          {
            AllocationTotal,
            categoryTotal,
          },
        ],
      });
    } catch (error) {
      console.error(error);
      reject({
        statuscode: "1",
        message: "Internal Server Error",
      });
    }
  });
};

exports.getAllocationById = async (userId, month, year) => {
  try {
    const allocation = await allocationDao.findExpensesAllocation(
      userId,
      month,
      year
    );
    if (!allocation)
      return { statusCode: "1", message: "Expenses Allocation not found" };

    return {
      statusCode: "0",
      message: "Expenses Allocation fetched successfully",
      data: allocation,
    };
  } catch (err) {
    console.error(err);
    return { statusCode: "1", message: "Internal Server Error" };
  }
};

exports.deleteAllocation = async (allocationId) => {
  try {
    const result = await allocationDao.deleteExpensesAllocation(allocationId);
    if (!result)
      return { statusCode: "1", message: "Expenses Allocation not found" };

    return {
      statusCode: "0",
      message: "Expenses Allocation deleted successfully",
    };
  } catch (err) {
    console.error(err);
    return { statusCode: "1", message: "Internal Server Error" };
  }
};
