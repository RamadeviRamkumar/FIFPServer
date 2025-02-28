const axios = require('axios');
const SchemeMetaData = require('../../Models/Amfi/amfiMetaDataModel');
const SchemeNavData = require('../../Models/Amfi/amfiNavDataModel');
const SchemaDaywiseNavData = require('../../Models/Amfi/daywiseNavDataModel');
const moment = require('moment')


exports.getbySchemeData = async (scheme) => {
  return new Promise(async (resolve, reject) => {
    try {
      const url = `https://api.mfapi.in/mf/${scheme}`;
      const response = await axios.get(url);


      if (!response.data || Object.keys(response.data).length === 0) {
        return reject({
          statusCode: "1",
          message: `${scheme} - Scheme Data Not Found`,
        });
      }

      const schemeData = {
        statusCode: "0",
        message: `${scheme} - Scheme Data Fetched Successfully`,
        data: response.data.data,
        status: response.data.status,
        scheme_code: response.data.meta.scheme_code,
        meta: {
          fund_house: response.data.meta.fund_house,
          scheme_type: response.data.meta.scheme_type,
          scheme_category: response.data.meta.scheme_category,
          scheme_code: response.data.meta.scheme_code,
          scheme_name: response.data.meta.scheme_name,
        },
      };

      await SchemeMetaData.deleteMany({ scheme_code: schemeData.scheme_code });
      await SchemeNavData.deleteMany({ scheme_code: schemeData.scheme_code });


      const newSchemeMetaData = new SchemeMetaData(schemeData);
      await newSchemeMetaData.save();



      const navEntries = schemeData.data.map((entry) => {

        const [day, month, year] = entry.date.split("-");
        const formattedDate = new Date(`${year}-${month}-${day}`);

        if (isNaN(formattedDate.getTime())) {
          return reject({ statusCode: "1", message: `Invalid date format: ${entry.date}` });
        }

        return {
          scheme_code: schemeData.scheme_code,
          date: formattedDate,
          nav: entry.nav,
        };
      });


      await SchemeNavData.insertMany(navEntries);

      return resolve(schemeData);


    } catch (error) {
      console.error("Error in getbySchemeData:", error.message || error);
      return reject({
        statusCode: 500,
        message: "Internal Server Error",
        error: error.message || error,
      });
    }
  });
};


exports.getbySchemeLatestData = async (scheme) => {
  return new Promise(async (resolve, reject) => {
    try {
      const url = `https://api.mfapi.in/mf/${scheme}/latest`;
      const response = await axios.get(url);


      if (!response.data || Object.keys(response.data).length === 0) {
        return reject({
          statusCode: "1",
          message: "Scheme Data Not Found",
        });
      }

      if (!response.data.data || !response.data.meta) {
        return reject({
          statusCode: "1",
          message: "Invalid response format",
        });
      }

      const lastData = response.data.data
      if (!lastData || !Array.isArray(lastData) || lastData.length === 0) {
        return reject({
          statusCode: "1",
          message: "No data found in the scheme",
        });
      }
      const { date, nav } = lastData[0]
      const { scheme_code } = response.data.meta
      if (!date || !nav || !scheme_code) {
        return reject({
          statusCode: "1",
          message: "Missing necessary data (date, nav, or scheme_code)",
        });
      }

      const [day, month, year] = date.split("-");
      const formattedDate = new Date(`${year}-${month}-${day}`);

      if (isNaN(formattedDate.getTime())) {
        return reject({
          statusCode: "1",
          message: `Invalid date format received: ${date}`,
        });
      }

      const existingNavData = await SchemeNavData.findOne({ scheme_code, date: formattedDate })
      if (existingNavData) {
        return resolve({
          statusCode: "0",
          message: `${scheme_code} - Scheme Code Data Already Up to Data is Available`,
          data: existingNavData
        })
      } else {
        const newNavEntry = new SchemeNavData({
          scheme_code,
          date: formattedDate,
          nav,
        });

        await newNavEntry.save();
        const dayWiseNewNavEntry = new SchemaDaywiseNavData({
          scheme_code,
          date: formattedDate,
          nav,
        })
        await dayWiseNewNavEntry.save()

        return resolve({
          statusCode: "0",
          message: `Latest data for scheme_code: ${scheme_code} added successfully.`,
          data: {
            scheme_code,
            date,
            nav,
          },
        });
      }



    } catch (error) {
      console.error("Error in getbySchemeData:", error.message || error);
      return reject({
        statusCode: 500,
        message: "Internal Server Error",
        error: error.message || error,
      });
    }
  });
};


exports.getNavDataBySchemeCode = async (schemeCode, startDate, endDate) => {
  return new Promise(async (resolve, reject) => {
    try {
      const start = moment(startDate, 'YYYY-MM-DD').startOf('day').utc().toDate();
      const end = moment(endDate, 'YYYY-MM-DD').endOf('day').utc().toDate();

      const navData = await SchemeNavData.find({
        scheme_code: parseInt(schemeCode),
        date: { $gte: start, $lte: end },
      }).sort({ date: 1 });

      if (!navData || navData.length === 0) {
        return reject({
          statusCode: "1",
          message: `${startDate} to ${endDate} - These Date Nav Data Not Found`
        })
      }
      return resolve({
        statusCode: "0",
        message: "Nav Data Fetched Successfully",
        data: navData
      })

    } catch (error) {
      console.error("Error in getNavByDateRange:", error.message || error);
      return reject({
        statusCode: 500,
        message: "Internal Server Error",
        error: error.message || error,
      });

    }
  })
}





