const accDetails = require('../../Dao/UserAccountDetails/accDetails')

exports.getAll = () =>{
    return new Promise(async(resolve, reject)=>{
        try {
            const getAllUser = await accDetails.getAllUser()
            if (!getAllUser || getAllUser.length === 0) {
                return reject({
                  statusCode: "1",
                  success: false,
                  message: "Users details could not be found",
                });
              }

              // Filter the fields you need
              const getUserAccDetails = Object.values(
                getAllUser.reduce((acc, user) => {
                  const year = new Date(user.createdAt).getFullYear();
                  const month = new Date(user.createdAt).getMonth() + 1; 
                  const key = `${year}-${month}`; // Unique key for grouping
        
                  if (!acc[key]) {
                    acc[key] = { year, month, count: 0 };
                  }
                  acc[key].count += 1;
        
                  return acc;
                }, {}) 
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