const ApiError = require("../errors/apiError");

const userMiddlewares = {};

userMiddlewares.obterTokenDoUsuario = (request, response, next) => {
    try{
        const baererToken = request.headers.authorization;
        const token = baererToken.split(" ")[1] || baererToken;

        request.user = token;
        
        console.log(`REQUESTED ${request.method} ${request.url} BY ID ${token}`);

        next();
    }catch(error){
        next(ApiError.unauthorized({message: "Unauthorized User"}))
    }
}

module.exports = userMiddlewares;