import { connect } from "mongoose";
import mysql from "mysql2/promise";
import ENV from "../config/enviroment.config.js";

const database_pool = mysql.createPool({
  host: ENV.MYSQL.HOST,
  user: ENV.MYSQL.USERNAME,
  password: ENV.MYSQL.PASSWORD,
  database: ENV.MYSQL.DATABASE,
  connectionLimit: 10,
});

const checkConnection = async () => {
  try {
    const connection = await database_pool.getConnection();
    await connection.query("SELECT 1"); // Consulta simple de excusa para chequear la conexion
    console.log("Connected to the MySQL database 🦾");
    connection.release(); // Kills the connection pool
  } catch (error) {
    console.error("ERROR connecting to database");
  }
};

checkConnection(); // Comprobamos la conexion

export default database_pool;
