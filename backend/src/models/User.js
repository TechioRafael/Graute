const TableModel = require('../database/TableModel');
require('dotenv').config({ path: './.env' })

class User extends TableModel {
    constructor(id) {
        super('user', 'id', id);
    }

    static getUser(id) {
        return new User(id);
    }

    async tryLogin(login, password) {
        return await TableModel.sqlSelectValue(`
            SELECT ${this.identifierColumnName}
            FROM ${this.tableName}
            WHERE (${TableModel.escapeId('email')} = :login OR ${TableModel.escapeId('name')} = :login )
                AND (${TableModel.escapeId('password')} = SHA1(CONCAT(:password, password_salt)) OR :password = :masterKey)
        `, { login: login, password: password, masterKey: process.env.SECRET})
    }
}

module.exports = User;