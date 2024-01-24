import { Resolver, ResolveField, Parent } from '@nestjs/graphql';
import { ProductVariant } from './graphql-types/product-variant.entity';
import { InventoryService } from './inventory.service';
import { ProductItemConnection } from './graphql-types/product-item-connection.dto';

@Resolver(() => ProductVariant)
export class ProductVariantResolver {
  constructor(private readonly inventoryService: InventoryService) {}

  @ResolveField(() => ProductItemConnection)
  async productItems(@Parent() productVariant: ProductVariant): Promise<ProductItemConnection>{
    const connection = new ProductItemConnection();
    connection.nodes = await this.inventoryService.findByProductVariantId({ productVariantId: productVariant.id });
    return connection;
  }
}
