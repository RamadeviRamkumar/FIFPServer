
const multer = require('multer');
const path = require('path');
const dataService = require("../../Service/Excel-Sheet/dataService");


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); 
  }
});

const upload = multer({ storage: storage }).single('filePath');

exports.uploadExcel = (req, res) => {
  //#swagger.tags = ['Excel-Sheet']

  // Use multer middleware to handle file upload
  upload(req, res, (err) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ message: "Error uploading file", error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Pass the file path to your data service
    const filePath = req.file.path;
    
    dataService.uploadExcel(filePath)
      .then((response) => {
        res.status(201).json(response);
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
      });
  });
};

exports.getAllData = (req, res) => {
  //#swagger.tags = ['Excel-Sheet']
  dataService
    .getAllData()
    .then((data) => {
      if (!data || data.length === 0) {
        return res.status(200).json({ message: "No data found" });
      }
      res.status(201).json({ message: "Data retrieved successfully", data });
    })
    .catch((error) => {
      if(error.statusCode === "1" && error.message === "No data found"){
        return res.status(200).json({
          statusCode:error.statusCode,
          message:error.message
        })
      }
      res
        .status(500)
        .json({ message: "Error retrieving data", error: error.message });
    });
};
