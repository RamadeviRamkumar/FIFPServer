const peersService = require('../../Service/Peers/peersService')
// const logger = require('../../utils/logger')

exports.getDetails = async(req,res)=>{
    //#swagger.tags=['Peers - Comparision']
    const{schemeName,type} = req.query
    if(!schemeName){
        return res.status(200).json({message:"SchmeName is Required"})
    }
    if(!type){
        return res.status(200).json({message:"Type is Required"})
    }
    peersService.getComparisionDetails(schemeName,type)
    .then((response)=>{
        logger.info("Peers Comparision Details Fetched Successfully")
        return res.status(201).json(response)
    })
    .catch((error)=>{
        if(error.statusCode === "1"){
            logger.error("Peers Comparision Data Not Found")
            return res.status(200).json({
                 error:error.statusCode,
                 message:error.message
            })
        }
        logger.error("Internal Server Error")
        return res.status(500).json({message:"Internal Server Error"})
    })
}