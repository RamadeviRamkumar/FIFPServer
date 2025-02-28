const usersDao = require("../../Dao/AdminDao/adminDao");

exports.getAll = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const users = await usersDao.getAllUsers();

      if (!users || users.length === 0) {
        return reject({
          statusCode: "1",
          message: "Users details could not be found",
        });
      }

      // Filter the fields you need
      const filteredUsers = users.map(user => ({
        email: user.email,
        loggedIn: user.loggedIn,
        updatedAt: new Date(user.updatedAt).toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
        }),
        createdAt: new Date(user.createdAt).toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
        }),
      }));

      return resolve({
        statusCode: "0",
        message: "Users details retrieved successfully",
        data: filteredUsers,
      });
    } catch (error) {
      return reject({
        statusCode: "1",
        message: "An error occurred",
        error: error.message,
      });
    }
  });
};

exports.getAllUsers = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const getAllUser = await usersDao.getAllUsers()
      if (!getAllUser || getAllUser.length === 0) {
        return reject({
          statusCode: "1",
          success: false,
          message: "Users details could not be found",
        });
      }

      // Filter the fields you need
      const groupedUsers = getAllUser.reduce((acc, user) => {
        const year = new Date(user.createdAt).getFullYear();
        const month = new Date(user.createdAt).getMonth() + 1;

        if (!acc[year]) {
          acc[year] = [];
        }
        // Find if the month entry already exists in the array
        let monthEntry = acc[year].find((entry) => entry.month === month);
        if (monthEntry) {
          monthEntry.count += 1;
        } else {
          acc[year].push({ month, count: 1 });
        }
        return acc;
      }, {})
      
      // Convert to array format
      const getUserAccDetails = Object.entries(groupedUsers).map(
        ([year, months]) => ({
          year: parseInt(year),
          months,
        })
      );
      return resolve({
        statusCode: "0",
        success: true,
        message: "Users Account details retrieved successfully",
        data: getUserAccDetails,
      });
    } catch (error) {
      return reject({
        statusCode: "1",
        message: "An error occurred",
        error: error.message,
      });
    }
  })
}