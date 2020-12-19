const express = require('express');
const middlewares = require('../middlewares/middlewares');

const router = express.Router();

router.get("/user", middlewares.obterTokenDoUsuario, (request, response) => {

    response.status(200).json({message:"Olá, obrigado por participar dessa etapa de teste"})
})

module.exports = router;