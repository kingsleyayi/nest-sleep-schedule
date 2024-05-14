import { DataSource, Not } from 'typeorm';
import { SleepEntry } from '../../src/config/database/models/sleepEntry.model';
import { User } from '../../src/config/database/models/user.model';
import {
  nodeEnv,
  testDatabaseHost,
  testDatabaseName,
  testDatabasePassword,
  testDatabasePort,
  testDatabaseUsername,
} from '../../src/config/environmentVariables';
import entities from '../../src/config/database/models/index.model';

export const dataSource = new DataSource({
  type: 'mysql',
  host: testDatabaseHost,
  port: Number(testDatabasePort),
  username: testDatabaseUsername,
  password: testDatabasePassword,
  database: testDatabaseName,
  entities: entities,
  synchronize: true,
});

export const clearDb = async () => {
  if (nodeEnv == 'test') {
    await dataSource.getRepository(SleepEntry).delete({ id: Not(0) });
    await dataSource.getRepository(User).delete({ id: Not(0) });
  }
};
