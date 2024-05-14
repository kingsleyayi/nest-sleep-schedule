import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import eventLogger from './config/logger/index.logger';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { nodeEnv, port } from './config/environmentVariables';
import { ValidationPipe } from '@nestjs/common';
import { urlencoded } from 'express';

async function bootstrap() {
  process.on('unhandledRejection', (reason, promise) => {
    eventLogger.error(`Unhandled Promise Rejection: ${reason}`);
  });

  process.on('uncaughtException', (reason, promise) => {
    eventLogger.error(`Uncaught Exception: ${reason}`);
  });

  const app = await NestFactory.create(AppModule);

  if (nodeEnv != 'production') {
    const config = new DocumentBuilder()
      .setTitle('Sleeping-Schedule API')
      .setDescription('backend REST endpoints for Sleeping-Schedule')
      .setVersion('1.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
        'Authorization',
      )
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-endpoints', app, document);
  }
  app.use(urlencoded({ limit: '10mb', extended: true }));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
    }),
  );

  await app.listen(port || 3000).then(() => {
    eventLogger.info(
      `Server started and running on port  ${port}, url : http://localhost:${port}/`,
    );
  });
}

bootstrap().catch((error) => {
  eventLogger.error(`Failed to start server: ERROR = ${error.message}`);
});
