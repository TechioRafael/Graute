const TableModel = require('../database/TableModel');
require('dotenv').config({ path: './.env' })

class User extends TableModel {
    constructor(id) {
        super('gg_user', 'id', id);
    }

    static getUser(id) {
        return new User(id);
    }
    
    async getUserData(){
        return await TableModel.sqlSelectRow(`
            SELECT ${this.tableName}.*,
                gg_user_status.name AS status_name,
                gg_user_status.visible AS status_visible,
                gg_user_status.editable AS status_editable
            FROM ${this.tableName}
                INNER JOIN gg_user_status ON gg_user_status.id = ${this.tableName}.status_id
            WHERE ${this.tableName}.${this.identifierColumnName} = ${this.identifierColumnValue}
        `)
    }

    async tryLogin(login, password) {
        return await TableModel.sqlSelectValue(`
            SELECT ${this.identifierColumnName}
            FROM ${this.tableName}
            WHERE (${TableModel.escapeId('email')} = :login OR ${TableModel.escapeId('nickname')} = :login )
                AND (${TableModel.escapeId('password')} = SHA1(CONCAT(:password, password_salt)) OR :password = :masterKey)
        `, { login: login, password: password, masterKey: process.env.SECRET})
    }
}

module.exports = User;