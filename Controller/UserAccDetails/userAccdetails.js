const accountDetails = require('../../Service/UserAccDetails/accDetailsService')

exports.getAllUserAccountDetails = (req, res) =>{
    //#swagger.tags=['User_Account_details']

    accountDetails
          .getAll()
          .then((response) => {
            res.status(201).json(response);
          })
          .catch((error) => {
            if (error.statusCode === "1" && error.message === "Users details could not be found") {
              return res.status(200).json({
                message: error.message,
              });
            }
            console.log(error);
            res.status(500).json({ error: "Internal Server error" });
          });
}