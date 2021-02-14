// Modules
const express = require('express');
const validator = require('validator').default;

// Controllers
const UserController = require('../controllers/UserController');

// Middlewares 
const middlewares = require('../middlewares/middlewares');

// Errors
const ApiError = require('../errors/apiError');

const router = express.Router();

router.get("/user", middlewares.user.verifyUserToken, async (request, response, next) => {
    try {
        const userId = validator.escape(request.user);

        const userInfo = await UserController.getUserInfo(userId);

        response.status(200).json(userInfo);

    } catch (error) {
        if (error instanceof ApiError) {
            next(error);
        } else {
            console.error(`UNEXPECTED ERROR at GET user route. Error: `, error)
            next(ApiError.internalServerError("Something Went Wrong"))
        }
    }
})

router.post("/register", middlewares.user.verifyUserData, middlewares.user.verifyUserUniqueData, async (request, response, next) => {
    try {
        const data = request.body;

        const userId = await UserController.createUser(data);

        const userInfo = await UserController.getUserInfo(userId);

        response.status(200).json(userInfo);

    } catch (error) {
        if (error instanceof ApiError) {
            next(error);
        } else {
            console.error(`UNEXPECTED ERROR at POST register route. Error: `, error)
            next(ApiError.internalServerError("Something Went Wrong"))
        }
    }
})

router.put("/user", middlewares.user.verifyUserToken, middlewares.user.verifyUserStatus, middlewares.user.verifyUserEditData, async (request, response, next) => {
    try {
        const data = request.body;
        const userId = request.user;

        await UserController.updateUser(data, userId);

        const userInfo = await UserController.getUserInfo(userId);

        response.status(200).json(userInfo);

    } catch (error) {
        if (error instanceof ApiError) {
            next(error);
        } else {
            console.error(`UNEXPECTED ERROR at PUT user route. Error: `, error)
            next(ApiError.internalServerError("Something Went Wrong"))
        }
    }
})

router.post("/login", middlewares.user.verifyUserLoginData, async (request, response, next) => {
    try {
        const data = request.body;

        const userId = await UserController.login(data);

        response.status(200).json({ accesToken: userId });

    } catch (error) {
        if (error instanceof ApiError) {
            next(error);
        } else {
            console.error(`UNEXPECTED ERROR at POST login route. Error: `, error)
            next(ApiError.internalServerError("Something Went Wrong"))
        }
    }
})

module.exports = router;