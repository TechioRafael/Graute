const express = require('express');
const validator = require('validator').default;

const middlewares = require('../middlewares/middlewares');
const UserController = require('../controllers/UserController');
const ApiError = require('../errors/apiError');

const router = express.Router();

router.get("/user", middlewares.obterTokenDoUsuario, async (request, response, next) => {
    const idUsuario = validator.escape(request.user);

    const infoUser = await UserController.getInfoUser(idUsuario);
    if(infoUser){
        response.status(200).json(infoUser);
    }else{
        next(ApiError.internalServerError("Something Gets Wrong"));
    }
})

module.exports = router;