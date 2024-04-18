import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { GraphQLSchemaHost } from '@nestjs/graphql';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { printSubgraphSchema } from '@apollo/subgraph';
import { logger } from './shared/logger/winston.config';
import { NestExpressApplication } from '@nestjs/platform-express';

/**
 * Initializes and starts the application.
 */
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // to enable request validation globally
  app.useGlobalPipes(new ValidationPipe());
  app.useBodyParser('json', {
    type: ['application/json', 'application/cloudevents+json'],
  });

  await app.listen(8080);

  // logging
  app.useLogger(logger);

  // workaround to generate the schema file with federation directives
  const { schema } = app.get(GraphQLSchemaHost);
  writeFileSync(
    join(process.cwd(), `/src/inventory.gql`),
    printSubgraphSchema(schema),
  );

  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
