const express = require("express");
const router = express.Router();
const ExpensesAllocation = require("../../Controller/ExpensesAllocation/allocationController");
const { verifyToken } = require("../../Middleware/authMiddleware");

router.post("/create", verifyToken,ExpensesAllocation.upsert);
router.post("/copyPreviousMonth",verifyToken, ExpensesAllocation.copyPreviousMonthData);
router.post("/subcategorysaveupdate",verifyToken,ExpensesAllocation.postSubCategoryValues);
router.delete("/delete/:allocationId", verifyToken, ExpensesAllocation.delete);
router.post("/getAll",verifyToken,ExpensesAllocation.getAll);
router.get("/:userId/:month/:year", verifyToken,ExpensesAllocation.getById);
router.put("/edit",  verifyToken,ExpensesAllocation.updateExpenseAmount);

module.exports = router;
