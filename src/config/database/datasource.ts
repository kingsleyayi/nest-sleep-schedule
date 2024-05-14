import { DataSource } from 'typeorm';
import {
  databaseHost,
  databaseName,
  databasePassword,
  databasePort,
  databaseUsername,
  nodeEnv,
  testDatabaseHost,
  testDatabaseName,
  testDatabasePassword,
  testDatabasePort,
  testDatabaseUsername,
} from '../environmentVariables';
import entities from './models/index.model';

const appDataSource = new DataSource({
  type: 'mysql',
  host: nodeEnv === 'test' ? testDatabaseHost : databaseHost,
  port: nodeEnv === 'test' ? testDatabasePort : databasePort,
  username: nodeEnv === 'test' ? testDatabaseUsername : databaseUsername,
  password: nodeEnv === 'test' ? testDatabasePassword : databasePassword,
  database: nodeEnv === 'test' ? testDatabaseName : databaseName,
  entities: entities,
  synchronize: true,
});


export default appDataSource;
