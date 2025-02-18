import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();


export class MySQLConfig {
    static dbConfig = {
        host: process.env.MYSQL_DB_HOST,
        port: process.env.MYSQL_DB_PORT,
        user: process.env.MYSQL_DB_USER,
        password: process.env.MYSQL_DB_PWD,
        database: process.env.MYSQL_DB_DBNAME,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    };
    static mysql_connection = null

    static async connectSQL(){
        this.mysql_connection = mysql.createConnection(this.dbConfig)
        this.mysql_connection.connect((error)=>{
            if (error) {
                console.log('error when connecting to db:', error);
                setTimeout(this.connectSQL, 2000);
            }
        })

        try {
            this.mysql_connection.on('error', (error)=> {
                if (error.code === 'PROTOCOL_CONNECTION_LOST') {
                    this.connectSQL();
                } else {
                    throw error;
                }
            });
            console.log("Mysql connected sucessfully")
            return this.mysql_connection
        } catch (error) {
            this.mysql_connection.end()
            this.connectSQL(); 
        }

    }
}



