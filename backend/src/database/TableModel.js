const connection = require('./connection');

class TableModel {
    constructor (tableName, identifierColumnName, identifierColumnValue){
        this.tableName = tableName,
        this.identifierColumnName = identifierColumnName,
        this.identifierColumnValue = identifierColumnValue;
    }

    async delete(){
        return await connection.sqlUpdate(`
            DELETE FROM ${connection.escapeId(this.tableName)}
            WHERE ${connection.escapeId(this.identifierColumnName)} = :rowid 
        `, {rowid: this.identifierColumnValue, value: value})
    }
    
    async create(objectData){
        return await connection.sqlInsert(`
            INSERT INTO ${connection.escapeId(this.tableName)}
                (${Object.keys(objectData).map(key => connection.escapeId(key)).join(", ")})
            VALUES (${Object.keys(objectData).map(key => `:${key}`).join(", ")})
        `, objectData);
    }

    async changeInfo(column, value){
        return await connection.sqlUpdate(`
            UPDATE ${connection.escapeId(this.identifierColumnName)} 
            SET ${connection.escapeId(column)} = :value
            FROM ${connection.escapeId(this.tableName)}
            WHERE ${connection.escapeId(this.identifierColumnName)} = :rowid 
        `, {rowid: this.identifierColumnValue, value: value})
    }

    async changeData(objectData){
        return await connection.sqlUpdate(`
            UPDATE ${connection.escapeId(this.identifierColumnName)}
            SET ${Object.keys(objectData).map(key => {
                return `${connection.escapeId(key)} = :${key}`
            })}
            FROM ${connection.escapeId(this.tableName)}
            WHERE ${connection.escapeId(this.identifierColumnName)} = :rowid
        `,{rowid: this.identifierColumnValue, ...objectData})
    }

    async getInfo(column){
        return await connection.sqlSelectValue(`
            SELECT ${connection.escapeId(column)}
            FROM ${connection.escapeId(this.tableName)}
            WHERE ${connection.escapeId(this.identifierColumnName)} = :rowid 
        `, {rowid: this.identifierColumnValue})
    }

    async getData(columns = ["*"]){
        return await connection.sqlSelectRow(`
            SELECT ${columns.map(column => column == '*' ? column : connection.escapeId(column)).join(", ")}
            FROM ${connection.escapeId(this.tableName)}
            WHERE ${connection.escapeId(this.identifierColumnName)} = :rowid 
        `, {rowid: this.identifierColumnValue})
    }

    // Connection functions 
    static async sqlInsert(query, params = {}){
        return await connection.sqlInsert(query, params);
    }

    static async sqlSelect(query, params = {}){
        return await connection.sqlSelect(query, params);
    }

    static async sqlSelectRow(query, params = {}){
        return await connection.sqlSelectRow(query, params);
    }

    static async sqlSelectValue(query, params = {}){
        return await connection.sqlSelectValue(query, params);
    }

    static async sqlUpdate(query, params = {}){
        return await connection.sqlUpdate(query, params);
    }

    async sqlDelete(query, params = {}){
        return await connection.sqlDelete(query, params);
    }

    static escapeId(string){
        return connection.escapeId(string);
    }

    static escape(string){
        return connection.escape(string);
    }
}

module.exports = TableModel;