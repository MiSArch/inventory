import { Logger, Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryResolver } from './inventory.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductItem, ProductItemSchema } from './entities/product-item.entity';
import { ProductVariantResolver } from './product-variant.resolver';
import { ProductVariantPartialModule } from 'src/product-variant-partial/product-variant-partial.module';

/**
 * Module for handling the e-stores inventory.
 */
@Module({
  imports: [
    // setup the MongooseModule with the ProductItem entity
    MongooseModule.forFeature([
      { name: ProductItem.name, schema: ProductItemSchema },
    ]),
    ProductVariantPartialModule
  ],
  providers: [InventoryResolver, InventoryService, ProductVariantResolver, Logger],
  exports: [InventoryService],
})
export class InventoryModule {}
