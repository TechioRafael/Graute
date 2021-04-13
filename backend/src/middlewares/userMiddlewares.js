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

        if (!baererToken) {
            console.log(`REQUESTED ${request.method} ${request.url} BY ID ${request.user}`);
            throw ApiError.badRequest('Authorization header is required')
        } else {
            const token = baererToken.split(" ")[1] || baererToken;

            request.user = jwt.verify(token, process.env.SECRET);

            console.log(`REQUESTED ${request.method} ${request.url} BY ID ${request.user}`);

            next();
        }
    } catch (error) {
        if (error instanceof ApiError) {
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
            nickname: yup.string().required().min(7).max(50),
            email: yup.string().required().email().max(25),
            password: yup.string().required().min(8).max(20).matches(validator.password, { message: 'Password must have letters and numbers' }),
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
            nickname: yup.string().notRequired().min(7).max(20),
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

middlewares.verifyUserEditStatus = async (request, response, next) => {
    try {
        connection.query(`
            SELECT 
                gg_user_status.id,
                gg_user_status.editable
            FROM gg_user
                INNER JOIN gg_user_status ON gg_user_status.id = gg_user.status_id
            WHERE gg_user.id = :id
        `, { id: request.user },
            (error, results, fields) => {
            if(error) {
                throw error;
            } else {
                if(!results || !results[0] || !results[0].id) {
            console.error(`ERROR - trying to verify user ${request.user} status. Results: `, results)
            next(ApiError.notFound(`User status not found`))
        } else if (!results[0].editable) {
            next(ApiError.forbidden(`User don't have permission to edit it own data.`))
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

middlewares.verifyUserDataStatus = async (request, response, next) => {
    try {
        connection.query(`
            SELECT 
                gg_user_status.id,
                gg_user_status.visible
            FROM gg_user
                INNER JOIN gg_user_status ON gg_user_status.id = gg_user.status_id
            WHERE gg_user.id = :id
        `, { id: request.user },
            (error, results, fields) => {
                if (error) {
                    throw error;
                } else {
                    if (!results || !results[0] || !results[0].id) {
                        console.error(`ERROR - trying to verify user ${request.user} status. Results: `, results)
                        next(ApiError.notFound(`User status not found`))
                    } else if (!results[0].visible) {
                        next(ApiError.forbidden(`User don't have permission to see it own data.`))
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
            SELECT id, nickname, email
            FROM ${connection.escapeId('gg_user')}
            WHERE nickname = :nickname 
                OR email = :email
        `, { nickname: request.body.nickname, email: request.body.email },
            (error, results, fields) => {
                if (error) {
                    throw error;
                } else {
                    if (results && results.length > 1) {
                        next(ApiError.conflict(`Name and Email alread be registred`))
                    } else if (
                        results && results[0] &&
                        results[0].nickname.toString().toLowerCase() == request.body.nickname.toLowerCase() &&
                        results[0].email.toString().toLowerCase() == request.body.email.toLowerCase()
                    ) {
                        next(ApiError.conflict(`Name and Email alread be registred`))
                    } else if (results && results[0] && results[0].nickname.toString().toLowerCase() == request.body.nickname.toLowerCase()) {
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