// Modules
const yup = require('yup');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: './.env' })

// Database
const connection = require('../database/connection');

// Errors
const ApiError = require("../errors/apiError");

// Helpers
const validator = require('../helpers/validator');

const middlewares = {};

middlewares.verifyUserToken = (request, response, next) => {
    try {
        const baererToken = request.headers.authorization;

        if(!baererToken){
            console.log(`REQUESTED ${request.method} ${request.url} BY ID ${request.user}`);
            throw ApiError.badRequest('Authorization header is required')
        }else {
            const token = baererToken.split(" ")[1] || baererToken;

            request.user = jwt.verify(token, process.env.SECRET);
    
            console.log(`REQUESTED ${request.method} ${request.url} BY ID ${request.user}`);
    
            next();
        }
    } catch (error) {
        if(error instanceof ApiError){
            next(error);
        } if (error.message == 'invalid signature') {
            console.log(`REQUESTED ${request.method} ${request.url} BY USER WITH INVALID TOKEN`);
            next(ApiError.unauthorized('Invalid token'))
        } else {
            console.error(`ERROR - trying to verify user token. Error: `, error);
            next(ApiError.internalServerError('Something Went Wrong'))
        }
    }
}

middlewares.verifyUserData = async (request, response, next) => {
    try {
        const schema = yup.object().required().shape({
            name: yup.string().required().min(7).max(50),
            email: yup.string().required().email().max(25),
            password: yup.string().required().min(8).max(20).matches(validator.password, {message: 'Password must have letters and numbers'}),
            birthdate: yup.date().required()
        });

        const normalizedData = await schema.validate(request.body)
        request.body = normalizedData;
        next();
    } catch (error) {
        console.error(`ERROR - trying to verify user data. Error: `, error.errors || error);
        next(ApiError.badRequest(error))
    }
}

middlewares.verifyUserEditData = async (request, response, next) => {
    try {
        const schema = yup.object().required().shape({
            name: yup.string().notRequired().min(7).max(20),
            email: yup.string().notRequired().email().max(25),
            password: yup.string().notRequired().min(8).max(20).matches(validator.password),
            birthdate: yup.date().notRequired()
        });

        const normalizedData = await schema.validate(request.body)
        request.body = normalizedData;
        next();
    } catch (error) {
        console.error(`ERROR - trying to verify user data. Error: `, error.errors || error);
        next(ApiError.badRequest(error))
    }
}

middlewares.verifyUserStatus = async (request, response, next) => {
    try {
        connection.query(`
            SELECT 
                user_status.id,
                user_status.can_edit_data
            FROM ${connection.escapeId(`user`)}
                INNER JOIN user_status ON user_status.id = ${connection.escapeId('user')}.id_status
            WHERE ${connection.escapeId(`user`)}.id = :id
        `, { id: request.user },
            (error, results, fields) => {
                if (error) {
                    throw error;
                } else {
                    if (!results || !results[0] || !results[0].id) {
                        console.error(`ERROR - trying to verify user ${req.user} status. Results: `, results)
                        next(ApiError.notFound(`User status not found`))
                    } else if (!results[0].can_edit_data) {
                        next(ApiError.forbidden(`User don't have permission to edit own data.`))
                    } else {
                        next();
                    }
                }
            })
    } catch (error) {
        console.error(`ERROR - trying to verify unique user data. Error: `, error);
        next(ApiError.internalServerError("Something gets wrong"))
    }
}

middlewares.verifyUserUniqueData = async (request, response, next) => {
    try {
        connection.query(`
            SELECT id, name, email
            FROM ${connection.escapeId(user)}
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
        console.error(`ERROR - trying to verify unique user data. Error: `, error);
        next(ApiError.internalServerError("Something gets wrong"))
    }
}

middlewares.verifyUserLoginData = async (request, response, next) => {
    try {
        const schema = yup.object().required().shape({
            login: yup.string().required(),
            password: yup.string().required()
        })

        const normalizedData = await schema.validate(request.body)
        request.body = normalizedData;
        next();
    } catch (error) {
        console.error(`ERROR - trying to verify user data. Error: `, error.errors || error);
        next(ApiError.badRequest(error))
    }
}
module.exports = middlewares;