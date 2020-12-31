const User = require('../models/User');

const getUserInfo = async (userId) => {
    try{

        const user = User.obterUser(userId);

        const userInfo = await user.getData();

        return userInfo;

    } catch (error){
        if(`ERROR - trying to GET user data with ID ${userId}. Error:`, error);
        return false;
    }
}

module.exports = {
    getUserInfo
}