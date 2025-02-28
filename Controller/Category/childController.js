const childExpensesService = require("../../Service/Category/childService");
// const logger = require("../../utils/logger");

exports.upsert = (req, res) => {
  //#swagger.tags = ['Child-Expenses']
  const { expensesId, category, userId } = req.body;
  if ((!expensesId, !category, !userId)) {
    logger.error(`${userId}-All fields are required`)
    return res.status(200).json({ error: "All fields are required" });
  }
  const child = {
    expensesId,
    category,
    userId,
  };
  childExpensesService
    .upsert(child)
    .then((response) => {
      res.status(201).json(response);
    })
    .catch((error) => {
      logger.error(`${userId}-Internal server error`,error)
      res.status(500).json({ error: "Internal server error" });
    });
};

exports.getAll = async (req, res) => {
  //#swagger.tags = ['Child-Expenses']
  const { userId } = req.query;
  if (!userId) {
    return res.status(200).json({ error: "All fields are required" });
  }
  childExpensesService
  .getAll(userId)
  .then((response)=>{
    res.status(201).json(response)
  })
  .catch((error)=>{
    if(error.statusCode === "1" && error.message === "User not found"){
      return res.status(200).json({
        statusCode:error.statusCode,
        message:error.message
      })
    }
    console.log(error);
    res.status(500).json({error:"Internal server error"});
  });
};

exports.getChildByMaster = async (req, res) => {
  //#swagger.tags = ['Child-Expenses']
  const { userId, title } = req.body;

  try {
    const result = await childExpensesService.getChildByMaster(userId, title);
    res.status(201).json(result);
  } catch (error) {
    if(error.statusCode === "1" && error.message === "Data Not Found"){
      logger.error(`${userId}-statusCode:error.statusCode,message:error.message`)
      return res.status(200).json({
        statusCode:error.statusCode,
        message:error.message
      })
    }
    res.status(500).json({
      statusCode: "1",
      message: "Failed to retrieve subcategories data",
    });
  }
};

exports.delete = async (req, res) => {
  //#swagger.tags = ['Child-Expenses']
  const { id } = req.params;
  try {
    const result = await childExpensesService.delete(id);
    res.status(201).json(result);
    logger.info(`${userId}-category deleted successfully`)
  } catch (error) {
    res.status(500).json({
      statusCode: "1",
      message: "Internal server error",
    });
  }
};

exports.search = async (req, res) => {
  //#swagger.tags = ['Child-Expenses']
  const searchTerm = req.query.searchTerm;

  if (!searchTerm) {
    return res.status(400).json({
      message: "Search term is required",
      data: [],
      statusCode: "1",
    });
  }

  try {
    const response = await childExpensesService.search(searchTerm);
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
