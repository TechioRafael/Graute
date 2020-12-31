const connection = require('./connection');

class TableModel {
    constructor (tableName, identifierColumnName, identifierColumnValue){
        this.tableName = tableName,
        this.identifierColumnName = identifierColumnName,
        this.identifierColumnValue = identifierColumnValue;
    }

    async delete(){
        return await connection.sqlUpdate(`
            DELETE FROM ${this.tableName}
            WHERE ${this.identifierColumnName} = '${this.identifierColumnValue}'
        `)
    }
    
    async create(objectData){
        return await connection.sqlInsert(`
            INSERT INTO ${this.tableName}
                (${Object.keys(objectData).join(", ")})
            VALUES ('${Object.values(objectData).join(", ")}')
        `);
    }

    async changeInfo(column, identifierColumnValue){
        return await connection.sqlUpdate(`
            UPDATE ${this.identifierColumnName} 
            SET ${column} = '${identifierColumnValue}'
            FROM ${this.tableName}
            WHERE ${this.identifierColumnName} = '${this.identifierColumnValue}'
        `)
    }

    async changeData(objectData){
        return await connection.sqlUpdate(`
            UPDATE ${this.identifierColumnName}
            SET ${Object.entries(objectData).map(arrayColunaValor => {
                return `${arrayColunaValor[0]} = '${arrayColunaValor[1]}'`
            })}
            FROM ${this.tableName}
            WHERE ${this.identifierColumnName} = '${this.identifierColumnValue}'
        `)
    }

    async getInfo(column){
        return await connection.sqlSelectValue(`
            SELECT ${column}
            FROM ${this.tableName}
            WHERE ${this.identifierColumnName} = '${this.identifierColumnValue}' 
        `)
    }

    async getData(columns = ["*"]){
        return await connection.sqlSelect(`
            SELECT ${columns.join(', ')}
            FROM ${this.tableName}
            WHERE ${this.identifierColumnName} = '${this.identifierColumnValue}' 
        `)
    }
}

module.exports = TableModel;