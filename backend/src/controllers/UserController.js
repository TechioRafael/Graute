// Modules
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: './.env' })

// Models
const User = require('../models/User');

// Helpers
const string = require('../helpers/string');

// Erros
const ApiError = require('../errors/apiError');

const getUserInfo = async (userId) => {
    try {

        const user = User.getUser(userId);

        const userInfo = await user.getUserData();

        const formattedData = {
            nickname: userInfo.nickname,
            email: userInfo.email,
            birthdate: userInfo.birthdate,
            status: {
                id: userInfo.status_id,
                name: userInfo.status_name,
                visible: !!userInfo.status_visible,
                editable: !!userInfo.status_editable,
            }
        }

        return formattedData;

    } catch (error) {
        console.error(`ERROR - trying to GET user data with ID ${userId}. Error:`, error);
        return false;
    }
}

const createUser = async (userData) => {
    try {
        const salt = string.randomString(9);

        const user = User.getUser();

        const newUserId = user.create({
            nickname: userData.nickname ? userData.nickname : '',
            email: userData.email ? userData.email : '',
            password: {
                raw: true,
                value: `SHA1('${userData.password}${salt}')`
            },
            password_salt: salt,
            birthdate: userData.birthdate,
        })

        return newUserId;
    } catch (error) {
        console.error(`ERROR - trying to CREATE user. Error:`, error);

        throw ApiError.internalServerError("Something gets wrong");
    }
}

const updateUser = async (userData, userId) => {
    try {
        const escapeData = {};

        const user = User.getUser(userId);
        // console.log(userData)

        if (userData.nickname) {
            escapeData.nickname = userData.nickname;
        }

        if (userData.email) {
            escapeData.email = userData.email;
        }
        
        if (userData.password) {
            const salt = string.randomString(9);

            escapeData.password = {
                raw: true,
                value: `SHA1('${userData.password}${salt}')`
            };

            escapeData.password_salt = salt;
        }

        if (userData.birthdate) {
            escapeData.birthdate = userData.birthdate;
        }

        if (Object.keys(escapeData).length > 0) {
            await user.changeData(escapeData);
        } else {
            throw ApiError.badRequest("No valid data given")
        }
    } catch (error) {
        if(error instanceof ApiError){
            throw error;
        }else{
            console.error(`ERROR - trying to Update User's (${userId}) data. Error:`, error);
            throw ApiError.internalServerError("Something Went Wrong");
        }
    }
}

const login = async (data) => {
    try {
        const user = User.getUser();

        const id = await user.tryLogin(data.login, data.password);

        if (id) {
            return jwt.sign(id, process.env.SECRET);
        } else {
            throw ApiError.notFound("Incorrect login or password")
        }

    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        } else {
            console.error(`ERROR - trying to login. Error:`, error);

            throw ApiError.internalServerError("Something gets wrong")
        }
    }
}

module.exports = {
    getUserInfo,
    createUser,
    updateUser,
    login
}