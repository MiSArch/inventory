import { Logger, Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryResolver } from './inventory.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductItem, ProductItemSchema } from './entities/product-item.entity';
import { ProductVariantResolver } from './product-variant.resolver';
import { ProductVariantStubModule } from 'src/product-variant-stub/product-variant-stub.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProductItem.name, schema: ProductItemSchema },
    ]),
    ProductVariantStubModule
  ],
  providers: [InventoryResolver, InventoryService, ProductVariantResolver, Logger],
})
export class InventoryModule {}
