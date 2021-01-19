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

router.get("/user", middlewares.getUserToken, async (request, response, next) => {
    try {
        const userId = validator.escape(request.user);

        const userInfo = await UserController.getUserInfo(userId);

        response.status(200).json(userInfo);
        
    } catch (error) {
        if (error instanceof ApiError) {
            next(error);
        } else {
            next(ApiError.internalServerError("Something Went Wrong"))
        }
    }
})

router.post("/user", middlewares.verifyUserData, middlewares.verifyUserUniqueData, async (request, response, next) => {
    try {
        const data = request.body;

        const userId = await UserController.createUser(data);

        const userInfo = await UserController.getUserInfo(userId);

        response.status(200).json(userInfo);

    } catch (error) {
        if (error instanceof ApiError) {
            next(error);
        } else {
            next(ApiError.internalServerError("Something Went Wrong"))
        }
    }
})

router.post("/user/login", middlewares.verifyUserLoginData, async (request, response, next) => {
    try {
        const data = request.body;

        const userId = await UserController.login(data);

        response.status(200).json({ accesToken: userId });

    } catch (error) {
        if (error instanceof ApiError) {
            next(error);
        } else {
            next(ApiError.internalServerError("Something Went Wrong"))
        }
    }
})

module.exports = router;