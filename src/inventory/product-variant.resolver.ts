import { Resolver, ResolveField, Parent } from '@nestjs/graphql';
import { ProductVariant } from './graphql-types/product-variant.entity';
import { InventoryService } from './inventory.service';
import { ProductItem } from './entities/product-item.entity';

@Resolver(() => ProductVariant)
export class UsersResolver {
  constructor(private readonly inventoryService: InventoryService) {}

  @ResolveField(() => [ProductItem])
  productVariants(@Parent() productVariant: ProductVariant) {
    return this.inventoryService.findByProductVariantId({ productVariantId: productVariant.id });
  }
}
