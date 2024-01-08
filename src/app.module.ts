import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { InventoryModule } from './inventory/inventory.module';
import { UUID } from './shared/scalars/CustomUuidScalar';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      resolvers: { UUID: UUID },
      autoSchemaFile: {
        federation: 2,
      },
    }),
    InventoryModule,
    MongooseModule.forRoot('mongodb://localhost/ecommerce'),
  ],
})
export class AppModule {}
