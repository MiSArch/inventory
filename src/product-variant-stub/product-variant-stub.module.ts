import { Logger, Module } from '@nestjs/common';
import { ProductVariantStubService } from './product-variant-stub.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductVariantStub, ProductVariantStubSchema } from './entities/product-variant-stub.entity';
import { InventoryModule } from 'src/inventory/inventory.module';

@Module({
  imports:[
    MongooseModule.forFeature([
      { name: ProductVariantStub.name, schema: ProductVariantStubSchema },
    ]),
  ],
  providers: [ProductVariantStubService, Logger],
})
export class ProductVariantStubModule {}
