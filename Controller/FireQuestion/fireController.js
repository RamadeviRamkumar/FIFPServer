const fireService = require("../../Service/FireQuestion/fireService");

exports.Create = (req, res) => {
  //#swagger.tags = ['Retirement-Plan']
  const {
    userId,
    fireId,
    age,
    retireage,
    currentExpense,
    inflation,
    monthlysavings,
    retirementsavings,
    prereturn,
    postreturn,
    expectancy,
    startDate,
  } = req.body;

  if (
    !userId ||
    !age ||
    !retireage ||
    !currentExpense ||
    !inflation ||
    !monthlysavings ||
    !retirementsavings ||
    !prereturn ||
    !postreturn ||
    !expectancy ||
    !startDate
  ) {
    return res.status(400).json({
      statusCode: "1",
      success: false,
      message: "All fields are required!",
    });
  }

  const reirementData = {
    userId,
    fireId,
    age,
    retireage,
    currentExpense,
    inflation,
    monthlysavings,
    retirementsavings,
    prereturn,
    postreturn,
    expectancy,
    startDate,
  };

  fireService
    .upsert(reirementData)
    .then((response) => {
      res.status(201).json(response);
    })
    .catch((error) => {
      const statusCode = error.statusCode === "1" ? 200 : 500;
      res.status(statusCode).json({
        statusCode: error.statusCode,
        success: false,
        message: error.message || "Internal Server Error",
      });
    });
};

exports.getAll = (req, res) => {
  //#swagger.tags = ['Retirement-Plan']
  const { userId } = req.query;
  if (!userId) {
    return res.status(200).json({
      statusCode: "1",
      success: false,
      message: "userId is required!",
    });
  }
  fireService
    .getAll(userId)
    .then((response) => {
      res.status(201).json(response);
    })
    .catch((error) => {
      const statusCode = error.statusCode === "1" ? 200 : 500;
      res.status(statusCode).json({
        statusCode: error.statusCode || "2",
        success: false,
        message: error.message || "Internal server error",
      });
    });
};

exports.pdfGenerate = (req, res) => {
  //#swagger.tags = ['Retirement-Plan']
  const { userId, pdfId } = req.body
  if (!userId) {
    return res.status(200).json({
      statuscode: "1",
      success: true,
      message: "userId are required!..."
    })
  }
  
  fireService
    .pdfGenerate(req.body)
    .then((response) => {
      res.status(201).json(response)
    })
    .catch((error) => {
      const statusCode = error.statusCode === "1" ? 200 : 500
      res.status(statusCode).json({
        statusCode: error.statusCode || "2",
        success: false,
        message: error.message || "Internal server error",
      })
    })
}

exports.getPdf = (req, res) =>{
  //#swagger.tags = ['Retirement-Plan']
  const { userId } = req.query;
  if (!userId) {
    return res.status(200).json({
      statusCode: "1",
      success: false,
      message: "userId is required!",
    });
  }
  fireService
    .getPdfById(userId)
    .then((response) => {
      res.status(201).json(response);
    })
    .catch((error) => {
      const statusCode = error.statusCode === "1" ? 200 : 500;
      res.status(statusCode).json({
        statusCode: error.statusCode || "2",
        success: false,
        message: error.message || "Internal server error",
      });
    });
}