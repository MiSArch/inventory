import { Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryResolver } from './inventory.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductItem, ProductItemSchema } from './entities/product-item.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProductItem.name, schema: ProductItemSchema },
    ]),
  ],
  providers: [InventoryResolver, InventoryService],
})
export class InventoryModule {}
