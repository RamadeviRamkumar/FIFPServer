const performanceSchema = require('../../Models/MutualFunds/performanceDataModel')

exports.getComparisionDetails = async (schemeName, type) => {
    return new Promise(async (resolve, reject) => {
        try {
            
            const primaryScheme = await performanceSchema.findOne({
                SchemeName: schemeName,
                type: type,
            });

            if (!primaryScheme) {
                return reject({
                    statusCode: "1",
                    message: `No data found for SchemeName: ${schemeName} and Type: ${type}`,
                });
            }

          
            const otherSchemes = await performanceSchema.find({
                SchemeName: { $ne: schemeName }, 
                type: type,
            })
                .sort({
                    "Returns.1Year.Regular": -1, 
                    "Returns.3Year.Regular": -1,
                    DailyAUMCr: -1, 
                })
                .limit(3); 

            
            const response = [];

            
            response.push({
                SchemeName: primaryScheme.SchemeName,
                type: primaryScheme.type,
                "1Year": primaryScheme?.Returns?.["1Year"] || null,
                "3Year": primaryScheme?.Returns?.["3Year"] || null,
                DailyAUMCr: primaryScheme?.DailyAUMCr || null,
            });

           
            for (let scheme of otherSchemes) {
                response.push({
                    SchemeName: scheme.SchemeName,
                    type: scheme.type,
                    "1Year": scheme?.Returns?.["1Year"] || null,
                    "3Year": scheme?.Returns?.["3Year"] || null,
                    DailyAUMCr: scheme?.DailyAUMCr || null,
                });
            }

          
            return resolve({
                statusCode: "0",
                message: "Peers Comparison Fetched Successfully",
                data: response,
            });
        } catch (error) {
            console.error("Error in getComparisionDetails:", error);
            return reject({
                statusCode: "500",
                message: "Internal Server Error",
            });
        }
    });
};
