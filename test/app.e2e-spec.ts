import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { clearDb, dataSource } from './helper/test.helper';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

const SECONDS = 1000;
jest.setTimeout(70 * SECONDS);

describe('App e2e test', () => {
  let app: INestApplication;

  beforeAll(async () => {
    await dataSource.initialize();
    await clearDb();
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });
  let userToken: string;

  describe('App api features', () => {
    it('Should Register User', async () => {
      return request(app.getHttpServer())
        .post('/users/create-user')
        .send({
          email: 'test1@gmail.com',
          firstName: 'test',
          otherNames: 'user one',
          password: 'user1234',
          confirmPassword: 'user1234',
          phoneNumber: '438012345678',
        })
        .expect(200)
        .then((res) => {
          expect(res.body).toHaveProperty('user');
        });
    });

    it('Should Login user', async () => {
      return request(app.getHttpServer())
        .post('/users/login-user')
        .send({
          email: 'test1@gmail.com',
          password: 'user1234',
        })
        .expect(200)
        .then((res) => {
          userToken = res.body.token;
        });
    });

    it('Should fetch user details', async () => {
      return request(app.getHttpServer())
        .get('/users/user-details')
        .set('Authorization', userToken)
        .expect(200)
        .then((res) => {
          expect(res.body).toHaveProperty('id');
        });
    });
  });
  afterAll(async () => {
    await app.close();
  });
});
