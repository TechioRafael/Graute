const TableModel = require('../database/TableModel');

class User extends TableModel{
    constructor(id){
        super('user','id', id);
    }

    static obterUser(id){
        return new User(id);
    }
}

module.exports = User;
