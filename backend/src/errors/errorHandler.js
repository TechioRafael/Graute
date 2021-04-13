const ApiError = require('./apiError');

const errorHandler = (error, request, response, next) => {
    if (error instanceof ApiError) {
        console.log("\033[0;31m"+`CATCHED ERROR - ${error.code} - `, (error.error.message || error.error), "\033[0m")

        response.status(error.code).json(error.error.message ? { message: error.error.message } : error.error)
    } else {
        console.log("\033[41;1;37m" + `UNEXPECTED ERROR: `, error, "\033[0m")

        response.status(500).json({ message: "Something gets wrong" });
    }

}

module.exports = errorHandler;