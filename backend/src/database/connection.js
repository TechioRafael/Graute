const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'graute'
})

connection.connect((error) => {
    if (error) {
        console.log(`ERROR - error trying access the database. Error: `, error);
    } else {
        console.log(`Conected to Database!`)
    }
})

connection.config.queryFormat = function (query, params = {}) {
    if (!params) return query;
    return query.replace(/\:(\w+)/g, function (txt, key) {
      if (params.hasOwnProperty(key)) {
          if(params[key] && params[key].raw){
            return params[key].value
          }else{
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
                console.log(`ERROR - SQL error on a SQL SELECT. Error: `, error);
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
                console.log(`ERROR - SQL error on a SQL SELECT ROW. Erro: `, error);
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
                console.log(`ERROR - SQL error on a SQL SELECT VALUE. Erro: `, error);
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
                console.log(`ERROR - SQL error on a SQL UPDATE. Erro: `, error);
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
                console.log(`ERROR - SQL error on a SQL DELETE. Erro: `, error);
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
                console.log(`ERROR - SQL error on a SQL INSERT. Erro: `, error);
                resolve(false);
            } else {
                resolve(results.insertId);
            }
        })
    });
}

module.exports = connection;