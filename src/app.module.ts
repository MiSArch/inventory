import { Logger, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule } from '@nestjs/config';
import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { InventoryModule } from './inventory/inventory.module';
import { UUID } from './shared/scalars/CustomUuidScalar';
import { MongooseModule } from '@nestjs/mongoose';
import { EventController } from './events/event.controller';
import { ProductVariantStubModule } from './product-variant-stub/product-variant-stub.module';

@Module({
  imports: [
    // For Configuration from environment variables
    ConfigModule.forRoot({ isGlobal: true }),
    // For GraphQL Federation v2
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      resolvers: { UUID: UUID },
      autoSchemaFile: {
        federation: 2,
      },
    }),
    InventoryModule,
    // For data persistence
    MongooseModule.forRoot(process.env.DATABASE_URI, {
      dbName: process.env.DATABASE_NAME,
    }),
    ProductVariantStubModule,
  ],
  providers: [Logger],
})
export class AppModule {}
