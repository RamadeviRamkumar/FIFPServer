const {compressImage} = require('../../Service/Login/pictureService')
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const pictureDao = require('../../Dao/Login/pictureDao')
require('dotenv').config();
// const pathProfile = require('../../config/secretCode/password')
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

// Automatically create the 'uploads' folder if it doesn't exist
const uploadsDir = path.join(__dirname, '/uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('Uploads folder created at:', uploadsDir);
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folderPath = path.join(__dirname, '/uploads'); // Correct absolute path
    cb(null, folderPath);
  },
  filename: (req, file, cb) => {
    ff = file;
    cb(null, `${req.body.userId}-${Date.now()}.png`);
  },
});

const upload = multer({ storage: storage });
exports.upload = upload;

exports.upsert = async (req, res) => {
  //#swagger.tags=['Profile-Picture']
  try {
    const { userId } = req.body;
    if (!ObjectId.isValid(userId)) {
      return res.status(200).json({ success: false, message: 'Invalid userId format' });
      
    }
    const userIdObject = new ObjectId(userId);
    const userIdcheck = await pictureDao.findByuserId(userIdObject)
    if (!userIdcheck || userIdcheck === null) {
      return res.status(200).json({ success: false, message: 'Invalid userId' });
    }
    const ff = req.file;
    if (!req.file) {
      return res.status(200).json({ success: false, message: 'No file uploaded' });
    }
    const allowedTypes = ['png', 'jpg', 'jpeg'];
    const fileType = ff.mimetype.split('/').pop();
    if (!allowedTypes.includes(fileType)) {
      return res.status(200).json({ success: false, message: 'Invalid file type' });
    }
    const imagePath = req.file.path;
    console.log("controller 54",imagePath)
    const value = await compressImage(imagePath);
console.log("controller 56", value)
    const uploadPath = path.join(__dirname, 'uploads');
    fs.readdir(uploadPath, (err, files) => {
      if (err) {
        console.error('Error reading directory:', err);
        return;
      }
      // Filter files that start with the given image ID
      const filteredFiles = files.filter(file => file.startsWith(userId));
      console.log('Filtered Images:', filteredFiles);
      if (filteredFiles.length === 1) {
        console.log('No matching files found.');
        return;
      }
      // Delete only the first matching file
      const firstFile = filteredFiles[0];
      const filePath = path.join(uploadPath, firstFile);

      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Error deleting file:', firstFile, err);
        } else {
          console.log('Deleted first matching file:', firstFile);
        }
      });
    });

    const url = pathProfile.PICTURE_PATH
    const imageUrl =`${url}/uploads/${ff.filename}`;

    res.status(201).json({
      success: true,
      message: 'Image uploaded successfully',
      data: { imageUrl: imageUrl }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error uploading image' });
  }
}

// Ensure 'uploads' directory exists

exports.getByuserId = async (req, res) => {
  //#swagger.tags=['Profile-Picture']
  try {
    const { userId } = req.query;
    if (!ObjectId.isValid(userId)) {
      return res.status(200).json({ success: false, message: 'Invalid userId format' });
    }
    const userIdObject = new ObjectId(userId);
    const userIdcheck = await pictureDao.findByuserId(userIdObject)
    if (!userIdcheck || userIdcheck === null) {
      return res.status(200).json({ success: false, message: 'Invalid userId' });
    }
    const uploadsDir = path.join(__dirname, 'uploads');
    if (fs.existsSync(uploadsDir)) {
      fs.readdir(uploadsDir, (err, files) => {
        if (err) {
          return res.status(200).json({ success: false, message: 'Error reading directory' });
        }
        const findImage = files.filter(file => file.startsWith(userId))
        if (findImage.length === 0) {
          return res.status(200).json({ success: false, message: 'No images found' });
        }
        const url = pathProfile.PICTURE_PATH
        const imageUrls = `${url}/uploads/${findImage}`;

        res.status(201).json({
          success: true,
          message: 'Image fetched successfully',
          data: { imageUrls }
        });
      });
    } else {
      res.status(200).json({ success: false, message: 'Uploads folder does not exist' });
    }

  } catch (error) {
    res.status(500).json({ success: false, message: 'Error uploading image' });
  }
}








