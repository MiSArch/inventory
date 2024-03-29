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
import { ProductVariantPartialModule } from './product-variant-partial/product-variant-partial.module';
import { EventModule } from './events/event.module';
import { RolesGuard } from './shared/guards/roles.guard';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    // For Configuration from environment variables
    ConfigModule.forRoot({ isGlobal: true }),
    // For GraphQL Federation v2
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      buildSchemaOptions: {
        numberScalarMode: 'integer'
      },
      context: ({ req }) => ({ request: req }),
      resolvers: { UUID: UUID },
      autoSchemaFile: {
        federation: 2,
      },
    }),
    // For data persistence
    MongooseModule.forRoot(process.env.DATABASE_URI, {
      dbName: process.env.DATABASE_NAME,
    }),
    ProductVariantPartialModule,
    InventoryModule,
    EventModule,
    HealthModule,
  ],
  // Provide the RolesGuard as a global guard
  providers: [{
    provide: 'APP_GUARD',
    useClass: RolesGuard
  }]
})
export class AppModule {}
