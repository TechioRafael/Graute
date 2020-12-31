const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'graute'
})

connection.connect((error) => {
    if (error) {
        console.log(`ERRO ao tentar conectar ao banco de dados. Erro: `, error);
    } else {
        console.log(`Conectado ao banco de dados!`)
    }
})

// Funções de Select

connection.sqlSelect = async (query) => {
    return await new Promise((resolve, reason) => {
        connection.query(query, (error, results, fields) => {
            if (error) {
                console.log(`ERRO de SQL em uma consulta SQL SELECT. Erro: `, error);
                resolve(false);
            } else {
                resolve(results);
            }
        })
    })
}

connection.sqlSelectRow = async (query) => {
    return await new Promise((resolve, reason) => {
        connection.query(query, (error, results, fields) => {
            if (error) {
                console.log(`ERRO de SQL em uma consulta SQL de SELECT ROW. Erro: `, error);
                resolve(false);
            } else {
                resolve(results[0]);
            }
        })
    });
}

connection.sqlSelectValue = async (query) => {
    return await new Promise((resolve, reason) => {
        connection.query(query, (error, results, fields) => {
            if (error) {
                console.log(`ERRO de SQL em uma consulta SQL de SELECT VALUE. Erro: `, error);
                resolve(false);
            } else {
                resolve(Object.values(results[0])[0]);
            }
        })
    });
}

// Funções de Update

connection.sqlUpdate = async (query) => {
    return await new Promise((resolve, reason) => {
        connection.query(query, (error, results, fields) => {
            if (error) {
                console.log(`ERRO de SQL em uma consulta SQL de UPDATE. Erro: `, error);
                resolve(false);
            } else {
                resolve(results.changedRows);
            }
        })
    });
}

// Funções de Delete

connection.sqlDelete = async (query) => {
    return await new Promise((resolve, reason) => {
        connection.query(query, (error, results, fields) => {
            if (error) {
                console.log(`ERRO de SQL em uma consulta SQL de DELETE. Erro: `, error);
                resolve(false);
            } else {
                resolve(results.affectedRows);
            }
        })
    });
}

// Funções de Insert

connection.sqlInsert = async (query) => {
    return await new Promise((resolve, reason) => {
        connection.query(query, (error, results, fields) => {
            if (error) {
                console.log(`ERRO de SQL em uma consulta SQL de INSERT. Erro: `, error);
                resolve(false);
            } else {
                resolve(results.insertId);
            }
        })
    });
}

module.exports = connection;