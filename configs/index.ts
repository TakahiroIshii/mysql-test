import { LogLevel } from "../src/utils";

const localhost = process.env.DOCKER_LOCALHOST || "localhost";

const restUrl = process.env.REST_URL || `http://${localhost}:3333`;

type DBTYPE = "mysql";
const dbtype: DBTYPE = "mysql";

const logLevel = process.env.LOG_LEVEL
  ? Number(process.env.LOG_LEVEL)
  : LogLevel.Info;

const restPort = Number(process.env.REST_PORT) || 3300;

export const config = {
  restUrl,
  restPort,
  logLevel,
  mySQL: {
    type: dbtype,
    host: "127.0.0.1",
    port: 3306,
    username: "root",
    password: "admin",
    database: "test_database",
    synchronize: true,
    logging: false,
  },
};
