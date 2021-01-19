// Modules
const yup = require('yup');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: './.env' })

// Database
const connection = require('../database/connection');

// Errors
const ApiError = require("../errors/apiError");

const userMiddlewares = {};

userMiddlewares.getUserToken = (request, response, next) => {
    try {
        const baererToken = request.headers.authorization;
        const token = baererToken.split(" ")[1] || baererToken;

        request.user = jwt.verify(token, process.env.SECRET);

        console.log(`REQUESTED ${request.method} ${request.url} BY ID ${request.user}`);

        next();
    } catch (error) {
        if (error.message == 'invalid signature') {
            console.log(`REQUESTED ${request.method} ${request.url} BY USER WITH INVALID TOKEN`);
            next(ApiError.unauthorized('Invalid token'))
        } else {
            console.log(`ERROR - trying to verify user token. Error: `, error);
            next(ApiError.internalServerError('Something Went Wrong'))
        }
    }
}

userMiddlewares.verifyUserData = async (request, response, next) => {
    try {
        const schema = yup.object().required().shape({
            name: yup.string().required().min(7),
            email: yup.string().required().email(),
            password: yup.string().required().min(8),
            birthdate: yup.date().required()
        });

        const normalizedData = await schema.validate(request.body)
        request.body = normalizedData;
        next();
    } catch (error) {
        console.log(`ERROR - trying to verify user data. Error: `, error.errors || error);
        next(ApiError.badRequest(error))
    }
}

userMiddlewares.verifyUserUniqueData = async (request, response, next) => {
    try {
        connection.query(`
            SELECT id, name, email
            FROM user
            WHERE name = :name 
                OR email = :email
        `, { name: request.body.name, email: request.body.email },
            (error, results, fields) => {
                if (error) {
                    throw error;
                } else {
                    if (results && results.length > 1) {
                        next(ApiError.conflict(`Name and Email alread be registred`))
                    } else if (
                        results && results[0] &&
                        results[0].name.toString().toLowerCase() == request.body.name.toLowerCase() &&
                        results[0].email.toString().toLowerCase() == request.body.email.toLowerCase()
                    ) {
                        next(ApiError.conflict(`Name and Email alread be registred`))
                    } else if (results && results[0] && results[0].name.toString().toLowerCase() == request.body.name.toLowerCase()) {
                        next(ApiError.conflict(`Name alread be registred`))
                    } else if (results && results[0] && results[0].email.toString().toLowerCase() == request.body.email.toLowerCase()) {
                        next(ApiError.conflict(`Email alread be registred`));
                    } else {
                        next();
                    }
                }
            })
    } catch (error) {
        console.log(`ERROR - trying to verify unique user data. Error: `, error);
        next(ApiError.internalServerError("Something gets wrong"))
    }
}

userMiddlewares.verifyUserLoginData = async (request, response, next) => {
    try {
        const schema = yup.object().required().shape({
            login: yup.string().required(),
            password: yup.string().required()
        })

        const normalizedData = await schema.validate(request.body)
        request.body = normalizedData;
        next();
    } catch (error) {
        console.log(`ERROR - trying to verify user data. Error: `, error.errors || error);
        next(ApiError.badRequest(error))
    }
}
module.exports = userMiddlewares;