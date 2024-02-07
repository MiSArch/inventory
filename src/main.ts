import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { GraphQLSchemaHost } from '@nestjs/graphql';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { printSubgraphSchema } from '@apollo/subgraph';
import { logger } from './shared/logger/winston.config';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useBodyParser('json', { type: ['application/json', 'application/cloudevents+json'] })
  await app.listen(8080);

  // to enable request validation globally
  app.useGlobalPipes(new ValidationPipe());

  console.log(`Application is running on: ${await app.getUrl()}`);

  // workaround to generate the schema file with federation directives
  const { schema } = app.get(GraphQLSchemaHost);
  writeFileSync(join(process.cwd(), `/src/inventory.gql`), printSubgraphSchema(schema));

  // logging
  app.useLogger(logger)
}
bootstrap();
