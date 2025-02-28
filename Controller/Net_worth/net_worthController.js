const netWorthService = require('../../Service/Net_worth/net_worthService.js')

exports.upsert = async (req, res) => {
    //#swagger.tags=['net_worth']
    try {
        const { userId, asserts, liabilities, netWorthId } = req.body
        if (
            !userId || !asserts || !liabilities || !Array.isArray(asserts) || !Array.isArray(liabilities) ||
            asserts.length === 0 || liabilities.length === 0
        ) {
            return res.status(200).json({ message: "All Fields are Required for asserts and liabilities" });
        }
        const response = await netWorthService.createNetWorth(req.body)
        if (response) {
            return res.status(201).json(response)
        }
    } catch (error) {
        const statusCode = error.statusCode === "1" ? 200 : 500;
        res.status(statusCode).json({
        statusCode: error.statusCode || "2",
        success: false,
        message: error.message || "Internal server error",
      });
    }
}

exports.getAll = async (req, res) => {
    //#swagger.tags=['net_worth']
    try {
        const { userId } = req.query;
        if (!userId) {
            return res.status(200).json({
                statusCode: "1",
                message: "userId is required",
            });
        }
        const response = await netWorthService.getAll(userId)
        if (response) {
            return res.status(201).json(response)
        }
    } catch (error) {
        const statusCode = error.statusCode === "1" ? 200 : 500;
        res.status(statusCode).json({
        statusCode: error.statusCode || "2",
        success: false,
        message: error.message || "Internal server error",
      });
    }
}

exports.delete = async (req, res) => {
    //#swagger.tags=['net_worth']
    try {
        const { userId } = req.query;
        if (!userId) {
            return res.status(400).json({
                statusCode: "1",
                message: "userId is required",
            });
        }
        const response = await netWorthService.delete(userId)
        if(response){
            return res.status(201).json(response)
        }
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error })
    }
}
