const amcServiceDetails = require('../../Service/MutualFunds/amcService');
const AMCData = require('../../Models/MutualFunds/amcListModel');
const CategoryData = require('../../Models/MutualFunds/amcCategoryModel');
const subCategoryData = require('../../Models/MutualFunds/amcSubCategoryModel')
const xlsx = require('xlsx');
const path = require('path')
const ExcelData = require('../../Models/MutualFunds/excelDataModel');
const filePath = path.join(__dirname, 'downloads', 'update.xls')
const moment = require("moment");
const performanceDataModel = require('../../Models/MutualFunds/performanceDataModel')

exports.create = async (req, res) => {
  //#swagger.tags=['Mutual-Funds']
  try {
    const { listOfAMC, listOfCategory, listOfSubCategory } = req.body;


    const amcData = Object.entries(listOfAMC).map(([code, name]) => ({ code, name }));
    await AMCData.insertMany(amcData);


    const categoryData = Object.entries(listOfCategory).map(([code, name]) => ({ code, name }));
    await CategoryData.insertMany(categoryData);

    const subCategoryDate = Object.entries(listOfSubCategory).map(([code, name]) => ({ code, name }));
    await subCategoryData.insertMany(subCategoryDate)

    res.status(201).send({ message: 'Data stored successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'An error occurred while storing data.' });
  }
}

exports.getAllAMCList = async (req, res) => {
  //#swagger.tags=['Mutual-Funds']
  amcServiceDetails.getDetails()
    .then((response) => {
      res.status(201).json(response)
    })
    .catch((error) => {
      if (error.statusCode === "1") {
        return res.status(200).json({
          statusCode: error.statusCode,
          message: error.message
        })
      }
      conosle.log(error)
      return res.status(500).json({ message: "Internal Server Error" })
    })


}

exports.getAllCategory = async (req, res) => {
  //#swagger.tags=['Mutual-Funds']
  try {
    const categorylist = await CategoryData.find()
    if (!categorylist) {
      return res.status(200).json({
        statusCode: "1",
        message: "Data Not Found"
      })
    }
    res.status(201).json({ statusCode: "0", message: "Category Details Fetched Successfully", data: categorylist })

  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" })
  }
}

exports.getAllSubCategory = async (req, res) => {
  //#swagger.tags=['Mutual-Funds']
  try {
    const { amc_Id, category_Id } = req.query
    if (!amc_Id || !category_Id) {
      return res.status(200).json({ message: "Select AMC and Category" })
    }
    const excelData = await ExcelData.find({ AMC: amc_Id, schemeCategory: category_Id })

    if (!excelData === 0) {
      return res.status(200).json({
        statusCode: "1",
        message: "No data found for the provided AMC and Category"
      })
    }

    const subCategoryIds = excelData.map(data => data.sub_Category);
    console.log(subCategoryIds)

    const subCategorylist = await subCategoryData.find({ code: { $in: subCategoryIds } }, { code: 1, name: 1 });
    if (!subCategorylist || subCategorylist.length === 0) {
      return res.status(200).json({
        statusCode: "1",
        message: "No sub-categories found for the provided AMC and Category"
      });
    }
    res.status(201).json({
      statusCode: "0", message: "SubCategory Details Fetched Successfully",
      data: subCategorylist.map(subCategory => ({
        code: subCategory.code,
        name: subCategory.name
      }))
    })

  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" })
  }
}


exports.excelData = async (req, res) => {
  //#swagger.tags=['Mutual-Funds']
  try {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const jsonData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const formattedData = jsonData.map((item) => {

      let rawLaunchDate = item['Launch_Date'];


      let launchDate = null;
      if (rawLaunchDate) {

        if (typeof rawLaunchDate === "string") {

          launchDate = moment(rawLaunchDate, ["MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"], true).isValid()
            ? moment(rawLaunchDate, ["MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"], true).format("YYYYMMDD")
            : null;
        } else if (typeof rawLaunchDate === "number") {

          launchDate = new Date((rawLaunchDate - 25569) * 86400 * 1000);
          launchDate = moment(launchDate).format("YYYYMMDD")
        }
      }

      let rawClosureDate = item['Closure_Date']
      let closureDate = null;
      if (rawClosureDate) {
        if (typeof rawClosureDate === "string") {

          closureDate = moment(rawClosureDate, ["DD/MMM/YY", "MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"], true).isValid()
            ? moment(rawClosureDate, ["DD/MMM/YY", "MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"], true).format("YYYYMMDD")
            : null;
        } else if (typeof rawClosureDate === "number") {
          closureDate = new Date((rawClosureDate - 25569) * 86400 * 1000);
          closureDate = moment(closureDate).format("YYYYMMDD");
        }
      }

      return {
        AMC: item.AMC,
        schemeCode: item.Code,
        schemeName: item['Scheme_Name'],
        schemeType: item['Scheme_Type'],
        schemeCategory: item['Scheme_Category'],
        sub_Category: item['Sub_Category'],
        schemeMinimumAmount: item['Scheme_Minimum_Amount'],
        launchDate: launchDate,
        closureDate: closureDate || null,
        ISIN_divPayout: item['ISIN Div Payout/ ISIN 2ISIN Div Reinvestment'],
      };
    })


    const validData = formattedData.filter((entry) => entry.launchDate !== null);
    await ExcelData.insertMany(validData);

    return res.status(201).json({ message: "Excel Data Saved In DataBase Successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};







exports.getAllDetails = async (req, res) => {
  //#swagger.tags=['Mutual-Funds']
  try {
    const { AMC_ID, category_ID, subCategory_ID, schemeCode } = req.query;

    const query = {};
    if (AMC_ID) query.AMC = AMC_ID;
    if (category_ID) query.schemeCategory = category_ID;
    if (subCategory_ID) query.sub_Category = subCategory_ID;
    if (schemeCode) query.schemeCode = schemeCode;

    const excelData = await ExcelData.find(query);

    if (!excelData || excelData.length === 0) {
      return res.status(200).json({ message: "No data found for the provided parameters" });
    }

    return res.status(201).json({ data: excelData });


  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred", error: error.message });
  }
};

exports.getPerformance = async (req, res) => {
  //#swagger.tags=['Mutual-Funds']
  try {
    const {  schemeName,navDate } = req.query

    if(!navDate){
      return res.status(200).json({message:"NavDate Field Are Required"})
    }
    if (schemeName) {
      const convertlowercase = schemeName.toLowerCase().replace(/\s+/g, '')
      console.log("???",convertlowercase)
      const existingSchemeName = await performanceDataModel.findOne({SchemeName: schemeName})
      if(existingSchemeName){
        const dataBaseSchemeName = existingSchemeName.SchemeName.toLowerCase().replace(/\s+/g,'')
        console.log(">>>>",dataBaseSchemeName)
      }else{
        console.log("schemename not found")
      }
     
      const performanceData = await performanceDataModel.find({ SchemeName: schemeName,"NAV.Date":navDate })
   
      if (!performanceData || performanceData.length === 0) {
        return res.status(200).json({ 
          message: `${schemeName} - PerformanceData Not Found` 
        });
      }

      const convertedData = performanceData.map(data => {
        const convertedReturns = {};
        for (const [key, value] of Object.entries(data.Returns)) {
          convertedReturns[key] = {
            Regular: value.Regular ? parseFloat(value.Regular) : null,
            Direct: value.Direct ? parseFloat(value.Direct) : null,
            BenchMark: value.BenchMark ? parseFloat(value.BenchMark) : null,
          };
        }

        return {
          ...data._doc,
          Returns: convertedReturns,
        };
      });

      return res.status(201).json({ message: `${schemeName} - Performance Data Fetched Successfully`, data: convertedData })
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: "Internal Server Error", error })
  }

}

