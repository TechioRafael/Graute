const ApiError = require('./apiError');

const errorHandler = (error, request, response, next) => {
    if (error instanceof ApiError) {
        console.log(`CATCHED ERROR - ${error.code} - `, error.error.message || error.error)

        response.status(error.code).json(error.error.message ? { message: error.error.message } : error.error)
    } else {
        console.log(`UNEXPECTED ERROR: `, error)

        response.status(500).json({ message: "Something gets wrong" });
    }

}

module.exports = errorHandler;