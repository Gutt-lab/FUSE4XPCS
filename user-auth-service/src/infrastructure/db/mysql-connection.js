const mysql = require('mysql2');

const db_config =
{
    host: process.env.MYSQL_DB_HOST,
    port: process.env.MYSQL_DB_PORT,
    user: process.env.MYSQL_DB_USER,
    password: process.env.MYSQL_DB_PWD,
    database: process.env.MYSQL_DB_DBNAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  
};


const pool = mysql.createPool(db_config);




module.exports = {pool}