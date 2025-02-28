const express = require("express");
const api = express.Router();

const emailRoute = require("./Router/emailRoute");
const pictureRoute = require("./Router/pictureRoute");
const googleRoute = require('./Router/googleRoute');
// const linkedRoute = require('./Router/linkedRoute');
const userRoute = require("./Router/userRoute");
const fireRoute = require("./Router/fireRoute");
const masterRoute = require("./Router/masterRoute");
const childRoute = require("./Router/childRoute");
const allocationRoute = require("./Router/allocationRoute");
const budgetRoute = require("./Router/budgetRoute");
const realityBudgetRoute = require("./Router/realityBudgetRoute");
const emergencyRoute = require("./Router/emergencyRoute");
const insuranceRoute = require("./Router/insuranceRoute");
const debtRoute = require("./Router/debtRoute");
const financialRoute = require("./Router/financialRoute");
const riskRoute = require("./Router/riskRoute");
const expensesRoute = require("./Router/expensesRoute");
const carplanRoute = require('./Router/carPlanRoute');
const dataRoute = require('./Router/dataRoute');
const childEducationRoute = require('./Router/childEducationRoute');
const houseBuyPlanRoute = require('./Router/houseBuyingPlanRoute');
const emergencyfundplan  = require('./Router/emergencyFundPlanRoute');
const amfiDataRoute = require('./Router/amfiDataRoute');
const mutualFundsRoute = require('./Router/mutualFundsRoute')
const customPlanRoute = require('./Router/customPlanRoute');
const automation = require('./Router/automation')
const logRoute = require('./Router/logRoute');
const peersRoute = require('./Router/peersRoute')
const netWorth = require('./Router/net_worthRoute')
const vehicle = require('./Router/vehicleRoute');

//admin
const adminRoute = require('./Router/adminRoute');


api.use("/user", emailRoute);
api.use("/picture",pictureRoute);
api.use('/google',googleRoute);
// api.use('/linkedin',linkedRoute);
api.use("/profile", userRoute);
api.use("/fire", fireRoute);
api.use("/master", masterRoute);
api.use("/child", childRoute);
api.use("/allocation", allocationRoute);
api.use("/budget", budgetRoute);
api.use("/emergency", emergencyRoute);
api.use("/insurance", insuranceRoute);
api.use("/debt", debtRoute);
api.use("/health", financialRoute);
api.use("/risk", riskRoute);
api.use("/realitybudget", realityBudgetRoute);
api.use('/realityExpenses',expensesRoute);
api.use('/carplan',carplanRoute);
api.use('/data',dataRoute);
api.use('/childeducation',childEducationRoute);
api.use('/housebuyingplan',houseBuyPlanRoute);
api.use('/emergencyfundplan',emergencyfundplan);
api.use('/vehicle',vehicle);
api.use('/customPlan',customPlanRoute);
api.use('/amfidata',amfiDataRoute);
api.use('/mutualfunds',mutualFundsRoute);
api.use('/automation',automation);
api.use('/logs',logRoute);
api.use('/peers',peersRoute);
api.use('/netWorth',netWorth);

// //admin settings
api.use('/admin', adminRoute);

module.exports = api;
