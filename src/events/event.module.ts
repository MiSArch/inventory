import { Logger, Module } from '@nestjs/common';
import { EventController } from './event.controller';
import { ProductVariantPartialModule } from 'src/product-variant-partial/product-variant-partial.module';

@Module({
  imports: [ProductVariantPartialModule],
  providers: [Logger],
  controllers: [EventController],
})
export class EventModule {}