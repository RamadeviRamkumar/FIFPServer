const profileService = require("../../Service/Login/userService");
const regex = require("../../Regex/regex");

exports.create = (req, res) => {
  //#swagger.tags = ['User-Profile']
  const {
    userId,
    firstName,
    lastName,
    email,
    annualIncome,
    dob,
    gender,
    address1,
    address2,
    state,
    district,
    country,
    panCard,
    aadharCard,
    pincode,
    city,
    occupation,
    contactNumber,
  } = req.body;

  if (panCard && !regex.panCard.test(panCard)) {
    return res.status(400).json({
      statusCode: "1",
      success: false,
      message: "Invalid PAN card format",
    });
  }

  if (aadharCard && !regex.aadharCard.test(aadharCard)) {
    return res.status(400).json({
      statusCode: "1",
      success: false,
      message: "Invalid Aadhar card format",
    });
  }

  const profileData = {
    userId,
    firstName,
    lastName,
    email,
    annualIncome,
    dob,
    gender,
    address1,
    address2,
    state,
    district,
    country,
    panCard,
    aadharCard,
    pincode,
    city,
    occupation,
    contactNumber,
  };

  profileService
    .create(profileData)
    .then((response) => {
      res.status(201).json(response);
    })
    .catch((error) => {
      const statusCode = error.statusCode === "1" ? 200 : 500;
      res.status(statusCode).json({
        statusCode: error.statusCode || "2",
        success: false,
        message: error.message || "Internal server error",
      });
    });
};

exports.getAll = (req, res) => {
  //#swagger.tags = ['User-Profile']
  const { userId } = req.query;

  if (!userId) {
    return res.status(200).json({
      statusCode: "1",
      success: false,
      message: "UserId is required!",
    });
  }

  profileService
    .getAll(userId)
    .then((response) => {
      res.status(201).json(response);
    })
    .catch((error) => {
      const statusCode = error.statusCode === "1" ? 200 : 500;
      res.status(statusCode).json({
        statusCode: error.statusCode || "2",
        success: false,
        message: error.message || "Internal server error",
      });
    });
};

exports.getById = (req, res) => {
  //#swagger.tags = ['User-Profile']
  const { profileId } = req.params;

  profileService
    .getUserProfileById(profileId)
    .then((response) => {
      res.status(201).json(response);
    })
    .catch((error) => {
      const statusCode = error.statusCode === "1" ? 200 : 500;
      res.status(statusCode).json({
        statusCode: error.statusCode || "2",
        success: false,
        message: error.message || "Internal server error",
      });
    });
};

exports.deleteById = (req, res) => {
  //#swagger.tags = ['User-Profile']
  const { profileId } = req.params;

  profileService
    .deleteUserProfileById(profileId)
    .then((response) => {
      res.status(201).json(response);
    })
    .catch((error) => {
      const statusCode = error.statusCode === "1" ? 200 : 500;
      res.status(statusCode).json({
        statusCode: error.statusCode || "2",
        success: false,
        message: error.message || "Internal server error",
      });
    });
};

exports.update = (req, res) => {
  //#swagger.tags = ['User-Profile']
  const { profileId } = req.params;
  const {
    userId,
    firstName,
    lastName,
    email,
    annualIncome,
    dob,
    gender,
    address1,
    address2,
    state,
    district,
    country,
    panCard,
    aadharCard,
    pincode,
    city,
    occupation,
    contactNumber,
  } = req.body;

  const profileData = {
    userId,
    firstName,
    lastName,
    email,
    annualIncome,
    dob,
    gender,
    address1,
    address2,
    state,
    district,
    country,
    panCard,
    aadharCard,
    pincode,
    city,
    occupation,
    contactNumber,
  };

  profileService
    .updateProfile(profileId, profileData, userId)
    .then((response) => {
      res.status(201).json(response);
    })
    .catch((error) => {
      const statusCode = error.statusCode === "1" ? 200 : 500;
      res.status(statusCode).json({
        statusCode: error.statusCode || "2",
        success: false,
        message: error.message || "Internal server error",
      });
    });
};
