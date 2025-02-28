const ChildExpenses = require("../../Models/Category/childModel");
const ExpensesMaster = require("../../Models/Category/masterModel");
const User = require("../../Models/Login/emailModel");

exports.findUserById = (userId) => {
  return User.findById(userId).exec();
};

exports.findExpensesById = (expensesId) => {
  return ChildExpenses.findById(expensesId).exec();
};

exports.findSearch = (searchTerm)=>{
  return ChildExpenses.find({
    category: { $regex: new RegExp(searchTerm, "i") },
  }).populate("expensesId", "title");
}
exports.getChildById= async (userId) => {
  return await ChildExpenses.find({ userId });
};

exports.upsertSubCategory = async (expensesId, category, userId) => {
  const expenses = await ChildExpenses.findById(expensesId).exec();
  if (!expenses) throw new Error("Expenses not found");

  const existingSubCategory = await ChildExpenses.findOne({
    expensesId,
  }).exec();
  if (existingSubCategory) {
    return ChildExpenses.findByIdAndUpdate(
      existingSubCategory._id,
      { $addToSet: { category: { $each: category } } },
      { new: true }
    ).exec();
  }

  const newSubCategory = new ChildExpenses({
    userId,
    expensesId,
    title: expenses.title,
    category,
    active: true,
  });

  return newSubCategory.save();
};

exports.findAllByUserId = (userId) => {
  return ChildExpenses.find({ userId }).exec();
};

exports.findChildByMaster = (userId, title) => {
  return ChildExpenses.findOne({ title, userId }).exec();
};

exports.deleteById = (id) => {
  return ChildExpenses.findByIdAndDelete(id).exec();
};

exports.searchByCategory = async (query) => {
  // const regex = new RegExp(searchTerm, "i");
  // return ChildExpenses.find({
  //   $or: [{ title: regex }, { category: { $elemMatch: { $regex: regex } } }],
  // }).exec();
  // const regex = new RegExp(searchTerm, "i"); // "i" makes it case-insensitive
    return await ChildExpenses.find(query);
};
