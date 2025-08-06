import { Sequelize } from 'sequelize';

const dbName = process.env.DB_NAME || "my_database";
const dbUser = process.env.DB_USER || "root";
const dbPassword = process.env.DB_PASSWORD || "root";
const dbHost = process.env.DB_HOST || "localhost";
const dbDialect = process.env.DB_DIALECT || "mysql";
const dbPort = process.env.DB_PORT || "3306";


const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  dialect: dbDialect as 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql',
  port: parseInt(dbPort, 10),
  logging: false,
});

export default sequelize;