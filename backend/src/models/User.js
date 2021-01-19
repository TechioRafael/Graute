const TableModel = require('../database/TableModel');

class User extends TableModel{
    constructor(id){
        super('user','id', id);
    }

    static getUser(id){
        return new User(id);
    }

    async tryLogin(login, password){
        return await TableModel.sqlSelectValue(`
            SELECT ${TableModel.escapeId(this.identifierColumnName)}
            FROM ${TableModel.escapeId(this.tableName)}
            WHERE (${TableModel.escapeId('email')} = :login OR ${TableModel.escapeId('name')} = :login )
                AND ${TableModel.escapeId('password')} = :password)
        `, {login: login, password: {raw: true, value: `SHA1(CONCAT(${TableModel.escape(password)}, password_salt)`}})
    }
}

module.exports = User;
