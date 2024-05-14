import { Repository } from 'typeorm';
import { EntityTarget } from 'typeorm/common/EntityTarget';
import appDataSource from '../datasource';

export class BaseRepository<T> extends Repository<T> {
  constructor(target: EntityTarget<T>) {
    super(target, appDataSource.createEntityManager());
  }
}
