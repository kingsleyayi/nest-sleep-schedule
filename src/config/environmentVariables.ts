import * as dotenv from 'dotenv';
dotenv.config();


export const nodeEnv = process.env.NODE_ENV;
export const logDir = process.env.LOG_DIR;
export const port = process.env.PORT;

export const databaseName = process.env.DATABASE_NAME;
export const databaseHost = process.env.DATABASE_HOST;
export const databaseUsername = process.env.DATABASE_USERNAME;
export const databasePassword = process.env.DATABASE_PASSWORD;
export const databasePort = Number(process.env.DATABASE_PORT);
export const databasePoolSize = Number(process.env.DATABASE_POOL_SIZE);

export const testDatabaseName = process.env.TEST_DATABASE_NAME;
export const testDatabaseHost = process.env.TEST_DATABASE_HOST;
export const testDatabaseUsername = process.env.TEST_DATABASE_USERNAME;
export const testDatabasePassword = process.env.TEST_DATABASE_PASSWORD;
export const testDatabasePort = Number(process.env.TEST_DATABASE_PORT);

export const jwtSecret = process.env.JWT_SECRET;
