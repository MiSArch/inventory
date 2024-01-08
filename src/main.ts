import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);

  app.useGlobalPipes(new ValidationPipe());
  app.enableShutdownHooks();

  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
