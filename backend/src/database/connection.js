const mysql = require('mysql');
require('dotenv').config({ path: './.env' })

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
})

connection.connect((error) => {
    if (error) {
        console.error("\033[0;31m" + `ERROR - error trying access the database. Error: `, error, "\033[0m");
    } else {
        console.log(`Conected to Database!`)
    }
})

connection.config.queryFormat = function (query, params = {}) {
    if (!params) return query;
    return query.replace(/\:(\w+)/g, function (txt, key) {
        if (params.hasOwnProperty(key)) {
            if (params[key] && params[key].raw) {
                return params[key].value
            } else {
                return this.escape(params[key]);
            }
        }
        return txt;
    }.bind(this));
};

// Select SQL Functions
connection.sqlSelect = async (query, params = {}) => {
    return await new Promise((resolve, reason) => {
        connection.query(query, params, (error, results, fields) => {
            if (error) {
                console.error("\033[0;31m" + `ERROR - SQL error on a SQL SELECT. Error: `, error, "\033[0m");
                resolve(false);
            } else {
                resolve(results);
            }
        })
    })
}

connection.sqlSelectRow = async (query, params = {}) => {
    return await new Promise((resolve, reason) => {
        connection.query(query, params, (error, results, fields) => {
            if (error) {
                console.error("\033[0;31m" + `ERROR - SQL error on a SQL SELECT ROW. Erro: `, error, "\033[0m");
                resolve(false);
            } else {
                resolve(results[0]);
            }
        })
    });
}

connection.sqlSelectValue = async (query, params = {}) => {
    return await new Promise((resolve, reason) => {
        connection.query(query, params, (error, results, fields) => {
            if (error) {
                console.error("\033[0;31m" + `ERROR - SQL error on a SQL SELECT VALUE. Erro: `, error, "\033[0m");
                resolve(false);
            } else {
                resolve(results[0] ? Object.values(results[0])[0] : false);
            }
        })
    });
}

// Update SQL Functions

connection.sqlUpdate = async (query, params = {}) => {
    return await new Promise((resolve, reason) => {
        connection.query(query, params, (error, results, fields) => {
            if (error) {
                console.error("\033[0;31m" + `ERROR - SQL error on a SQL UPDATE. Erro: `, error, "\033[0m");
                resolve(false);
            } else {
                resolve(results.changedRows);
            }
        })
    });
}

// Delete SQL Functions

connection.sqlDelete = async (query, params = {}) => {
    return await new Promise((resolve, reason) => {
        connection.query(query, params, (error, results, fields) => {
            if (error) {
                console.error("\033[0;31m" + `ERROR - SQL error on a SQL DELETE. Erro: `, error, "\033[0m");
                resolve(false);
            } else {
                resolve(results.affectedRows);
            }
        })
    });
}

// Insert SQL Functions

connection.sqlInsert = async (query, params = {}) => {
    return await new Promise((resolve, reason) => {
        connection.query(query, params, (error, results, fields) => {
            if (error) {
                console.error("\033[0;31m" + `ERROR - SQL error on a SQL INSERT. Erro: `, error, "\033[0m");
                resolve(false);
            } else {
                resolve(results.insertId);
            }
        })
    });
}

module.exports = connection;