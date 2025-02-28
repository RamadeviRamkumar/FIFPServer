const amcDataModel = require('../../Models/MutualFunds/amcListModel')

exports.getDetails = async () => {
    return new Promise(async (resolve, reject) => {
        try {
           const amcList = await amcDataModel.find()
            if(!amcList){
                return reject({statusCode:"1",message:"Data Not Found"})
            }
            return resolve({
                statusCode:"0",
                message:"All AMC Name Fetched Succesffully",
                data:amcList
            })
        } catch (error) {
            return res.status(500).json({message:"Internal Server Error"})
        }
    })

}