import { Logger, Module } from '@nestjs/common';
import { ProductVariantPartialService } from './product-variant-partial.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductVariantPartial, ProductVariantPartialSchema } from './entities/product-variant-partial.entity';

/**
 * Module for the imported ProductVariantPartial entity.
 */
@Module({
  imports:[
    // setup the MongooseModule with the ProductVariantPartial entity
    MongooseModule.forFeature([
      { name: ProductVariantPartial.name, schema: ProductVariantPartialSchema },
    ]),
  ],
  providers: [ProductVariantPartialService, Logger],
  exports: [ProductVariantPartialService],
})
export class ProductVariantPartialModule {}
