const amfiDataService = require('../../Service/Amfi/amfiDataService');
// const logger = require('../../utils/logger')

exports.getbyScheme = async (req, res) => {
       //#swagger.tags=['AMFI-DATA']
    try {
      const scheme = req.params.scheme;
      if (!scheme) {
        return res.status(200).json({
          statusCode: "1",
          message: "Scheme parameter is required",
        });
      }
  
      const response = await amfiDataService.getbySchemeData(scheme);
      logger.info("AMFI Data Fetched Sucessfully")
      res.status(201).json(response);
    } catch (error) {
      console.error("Error in getbyScheme:", error); 
      if ((error.statusCode === "1" && error.message === `${scheme} - Scheme Data Not Found`) || (error.statusCode === "1" && error.message === `Invalid date format: ${entry.date}`) ){
        return res.status(200).json({
          statusCode: error.statusCode,
          message: error.message,
        });
      }
      res.status(500).json({
        statusCode: 500,
        message: "Internal Server Error",
      });
    }
  };


  exports.getbySchemeLatestData = async (req, res) => {
    //#swagger.tags=['AMFI-DATA']
 try {
   const scheme = req.params.scheme;
   if (!scheme) {
     return res.status(200).json({
       statusCode: "1",
       message: "Scheme parameter is required",
     });
   }

   const response = await amfiDataService.getbySchemeLatestData(scheme);
   res.status(201).json(response);
 } catch (error) {
   console.error("Error in getbyScheme:", error); 
   if (error.statusCode === "1" && error.message === "Scheme Data Not Found") {
     return res.status(200).json({
       statusCode: error.statusCode,
       message: error.message,
     });
   }
   res.status(500).json({
     statusCode: 500,
     message: "Internal Server Error",
   });
 }
};


exports.getNavBySchemeCode = async(req,res)=>{
    //#swagger.tags=['AMFI-DATA']
    try {
        const{schemeCode,startDate,endDate} = req.query
        if(!startDate && !endDate && !schemeCode){
            return res.statuc(200).json({
                statusCode:"1",
                message:"StartDate,EndDate,SchmeCode are required"
            })
        }
        const response = await amfiDataService.getNavDataBySchemeCode(schemeCode,startDate,endDate)
        res.status(201).json(response)
        
    } catch (error) {
        if(error.statusCode === "1"){
            return res.status(200).json({
                statusCode:error.statusCode,
                message:error.message
            })
        }
        return res.status(500).json({
            message:"Internal Server Error"
        })
    }
}
