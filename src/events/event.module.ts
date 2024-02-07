import { Logger, Module } from '@nestjs/common';
import { EventController } from './event.controller';
import { ProductVariantStubModule } from 'src/product-variant-stub/product-variant-stub.module';

@Module({
  imports: [ProductVariantStubModule],
  providers: [Logger],
  controllers: [EventController],
})
export class EventModule {}