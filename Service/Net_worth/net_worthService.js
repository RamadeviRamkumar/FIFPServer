const netWorthDao = require('../../Dao/Net_worth/net_worthDao')
const emailDao = require('../../Dao/Login/emailDao')

exports.createNetWorth = (data) => {
    return new Promise(async(resolve,reject)=>{
        try {
            const { userId, asserts, liabilities, netWorthId } = data
            const existingUser = await emailDao.findUserById(userId)
            if (!existingUser) {
                return reject({
                    statusCode: "1",
                    success: false,
                    message: "User not found",
                });
            }

            function isMeaningfulText(text) {
                return /^[a-zA-Z\s]+$/.test(text) && /[a-zA-Z]/.test(text);
            }
            if (Array.isArray(asserts)) {
                for (let asset of asserts) {
                    if (asset.key && !isMeaningfulText(asset.key)) {
                        return reject({
                            statusCode: "1",
                            success: false,
                            message: `Invalid asset key: "${asset.key}". It must contain only letters and spaces.`,
                        });
                    }
                }
            }
            if (Array.isArray(liabilities)) {
                for (let liability of liabilities) {
                    if (liability.key && !isMeaningfulText(liability.key)) {
                        return reject({
                            statusCode: "1",
                            success: false,
                            message: `Invalid liability key: "${liability.key}". It must contain only letters and spaces.`,
                        });
                    }
                }
            }
            if (netWorthId) {
                const networth = await netWorthDao.findNetworthById(netWorthId);
                if(!networth) {
                    return reject({
                        statusCode : "1",
                        success : false,
                        message : "networth Data not found!"
                    });
                }
                const assertKeys = asserts.map((item) => item.key.toLowerCase());
                const duplicateAssertKeys = assertKeys.filter(
                    (key, index, keys) => keys.indexOf(key) !== index
                );
                if(duplicateAssertKeys.length > 0){
                    return reject ({
                        statusCode: "1",
                        success: false,
                        message: `Duplicate key(s) found in asserts: ${[...new Set(duplicateAssertKeys)].join(', ')}`,
                    })
                }

                const liabilityKeys = liabilities.map((item) => item.key.toLowerCase());
                const duplicateLiabilityKeys = liabilityKeys.filter(
                    (key, index, keys) => keys.indexOf(key) !== index
                );
                if(duplicateLiabilityKeys.length > 0){
                    return reject ({
                        statusCode: "1",
                        success: false,
                        message: `Duplicate key(s) found in liabilities: ${[...new Set(duplicateLiabilityKeys)].join(', ')}`,
                    })
                }
                
                let totalAsserts = asserts.reduce((acc, assert) => acc + parseFloat(assert.value), 0);
                let totalLiabilities = liabilities.reduce((acc, liability) => acc + parseFloat(liability.value), 0);
                let netWorth = totalAsserts - totalLiabilities
                const netWorthData = {
                    userId,
                    asserts,
                    totalAsserts,
                    liabilities,
                    totalLiabilities,
                    netWorth
                };
                const filter = { _id: netWorthId };
                const updateNetworth = await netWorthDao.update(filter, netWorthData)
                return resolve ({
                    statusCode: "0",
                    success: true,
                    message: "net worth updated successfully",
                    data: updateNetworth,
                });
            } else {
                const assertKeys = asserts.map((item) => item.key.toLowerCase());
                const duplicateAssertKeys = assertKeys.filter(
                    (key, index, keys) => keys.indexOf(key) !== index
                );
                if(duplicateAssertKeys.length > 0){
                    return reject ({
                        statusCode: "1",
                        success: false,
                        message: `Duplicate key(s) found in asserts: ${[...new Set(duplicateAssertKeys)].join(', ')}`,
                    })
                }

                const liabilityKeys = liabilities.map((item) => item.key.toLowerCase());
                const duplicateLiabilityKeys = liabilityKeys.filter(
                    (key, index, keys) => keys.indexOf(key) !== index
                );
                if(duplicateLiabilityKeys.length > 0){
                    return reject ({
                        statusCode: "1",
                        success: false,
                        message: `Duplicate key(s) found in liabilities: ${[...new Set(duplicateLiabilityKeys)].join(', ')}`,
                    })
                }
                const existingNetWorth = await netWorthDao.findNetworth(userId)
                if (existingNetWorth) {
                    return reject({
                        statusCode: "1",
                        success: false,
                        message: "Already created from this user id. try to update",
                    })
                }
                let totalAsserts = asserts.reduce((acc, assert) => acc + parseFloat(assert.value), 0);
                let totalLiabilities = liabilities.reduce((acc, liability) => acc + parseFloat(liability.value), 0);
                let netWorth = totalAsserts - totalLiabilities;
                const netWorthData = {
                    userId,
                    asserts,
                    totalAsserts,
                    liabilities,
                    totalLiabilities,
                    netWorth
                };
                const result = await netWorthDao.createNetWorth(netWorthData)
                return resolve({
                    statusCode: "0",
                    success: true,
                    message: "net worth created successfully",
                    data: result,
                });
            }
        } catch (error) {
            return {
                statusCode: "1",
                message: "An error occurred",
                error: error.message,
            }
        }
    })
}

exports.getAll = async (userId) => {
    return new Promise(async(resolve,reject)=>{
        try {
            const NetWorth = await netWorthDao.getByUserId(userId);
            const date = NetWorth.updatedAt.toLocaleDateString();
            const time = NetWorth.updatedAt.toLocaleTimeString();
            if (!NetWorth || NetWorth.length === 0) {
                return reject({
                    statusCode: "1",
                    success: false,
                    message: "No net_worth found for the provided userId!",
                });
            }
            return resolve({
                statusCode: "0",
                success: true,
                message: "net_worth Data retrieved successfully!",
                data: NetWorth,
                date,
                time
            });
        } catch (error) {
            return {
                statusCode: "1",
                success: false,
                message: "An error occurred",
                error: error.message,
            }
        }
    })
}

exports.delete = async (userId) => {
    try {
        const deleteNetWorth = await netWorthDao.deleteByUserId(userId)
        if (!deleteNetWorth || deleteNetWorth.length === 0) {
            return {
                statusCode: "1",
                success: false,
                message: "No net_worth found for the provided userId!",
            }
        }
        return {
            statusCode: "0",
            success: true,
            message: "net_worth Data deleted successfully!",
            
        }
    } catch (error) {
        return {
            statusCode: "2",
            success: false,
            message: "An error occurred",
            error: error.message,
        }
    }
}