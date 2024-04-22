import { Logger, Module } from '@nestjs/common';
import { EventController } from './event.controller';
import { ProductVariantPartialModule } from 'src/product-variant-partial/product-variant-partial.module';
import { InventoryModule } from 'src/inventory/inventory.module';
import { EventPublisherService } from './event-publisher.service';

/**
 * Module for handling events.
 */
@Module({
  imports: [ProductVariantPartialModule, InventoryModule],
  providers: [Logger, EventPublisherService],
  controllers: [EventController],
})
export class EventModule {}