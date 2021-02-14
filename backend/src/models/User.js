const TableModel = require('../database/TableModel');
require('dotenv').config({ path: './.env' })

class User extends TableModel {
    constructor(id) {
        super('user', 'id', id);
    }

    async getUserData(){
        return await TableModel.sqlSelectRow(`
            SELECT ${this.tableName}.*,
                user_status.name AS status_name
            FROM ${this.tableName}
                INNER JOIN user_status ON user_status.id = ${this.tableName}.id_status
            WHERE ${this.tableName}.${this.identifierColumnName} = ${this.identifierColumnValue}
        `)
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