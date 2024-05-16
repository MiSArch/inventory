import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule, ConfigService } from '@nestjs/config';
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

/**
 * The main module of the application.
 */
@Module({
  imports: [
    // For Configuration from environment variables
    ConfigModule.forRoot({ isGlobal: true, ignoreEnvFile: true }),
    // For GraphQL Federation v2
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      buildSchemaOptions: {
        numberScalarMode: 'integer',
      },
      context: ({ req }) => ({ request: req }),
      resolvers: { UUID: UUID },
      autoSchemaFile: {
        federation: 2,
      },
      // necessary to use guards on @ResolveField with drawbacks on performance
      fieldResolverEnhancers: ['guards'],
    }),
    // For data persistence
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>("DATABASE_URI", "mongodb://localhost:27017"),
        dbName: configService.get<string>("DATABASE_NAME", "test"),
      }),
      inject: [ConfigService],
    }),
    ProductVariantPartialModule,
    InventoryModule,
    EventModule,
    HealthModule,
  ],
  // Provide the RolesGuard as a global guard
  providers: [
    {
      provide: 'APP_GUARD',
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
