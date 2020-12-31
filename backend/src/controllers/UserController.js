const User = require('../models/User');

const getInfoUser = async (idUsuario) => {
    try{

        const user = User.obterUser(idUsuario);

        const userInfo = await user.getData();

        return userInfo;

    } catch (error){
        if(`ERRO ao tentar obter infos do usuário de ID ${idUsuario}. Erro:`, error);
        return false;
    }
}

module.exports = {
    getInfoUser
}