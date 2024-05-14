import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import appDataSource from './config/database/datasource';
import entities from './config/database/models/index.model';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SleepScheduleModule } from './sleep-schedule/sleep-schedule.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('HOST'),
        port: +configService.get('PORT'),
        username: configService.get('USERNAME'),
        password: configService.get('PASSWORD'),
        database: configService.get('DATABASE'),
        entities: entities,
        synchronize: true,
      }),
      dataSourceFactory: async () => {
        const dataSource = await appDataSource.initialize();
        return dataSource;
      },
    }),
    UsersModule,
    SleepScheduleModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
