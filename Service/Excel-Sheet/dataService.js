const dataDao = require("../../Dao/Excel-Sheet/dataDao");
const XLSX = require("xlsx");
const fs = require("fs").promises;

exports.uploadExcel = (filePath) => {
  return new Promise(async (resolve, reject) => {
    try {
      
      console.log("Provided file path:", filePath);

      const stats = await fs.stat(filePath).catch(() => null);
      if (!stats) {
        return reject(new Error(`File does not exist at path: ${filePath}`));
      }
      if (!stats.isFile()) {
        return reject(new Error("Provided path is not a file"));
      }

      const fileBuffer = await fs.readFile(filePath);

      const workbook = XLSX.read(fileBuffer, { type: "buffer" });

      const sheetName = workbook.SheetNames[0];
      const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
        header: 1,
      });

      const [headers, ...rows] = sheetData;
      const jsonData = rows.map((row) => {
        const obj = {};
        headers.forEach((header, index) => {
          obj[header] = row[index];
        });
        return obj;
      });

      const result = await dataDao.saveData(jsonData);
      resolve(result);
    } catch (error) {
      reject(new Error(`Error processing Excel file: ${error.message}`));
    }
  });
};



exports.getAllData = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await dataDao.fetchAllData();

      if (!data || data.length === 0) {
        return reject({
          statusCode:"1",
          message:"No data found"});
      }

      resolve(data);
    } catch (error) {
      reject(new Error(`Error retrieving data: ${error.message}`));
    }
  });
};
