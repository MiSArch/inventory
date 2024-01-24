import { Resolver, ResolveField, Parent } from '@nestjs/graphql';
import { ProductVariant } from './graphql-types/product-variant.entity';
import { InventoryService } from './inventory.service';
import { ProductItem } from './entities/product-item.entity';

@Resolver(() => ProductVariant)
export class UsersResolver {
  constructor(private readonly inventoryService: InventoryService) {}

  @ResolveField(() => [ProductItem])
  posts(@Parent() productVariant: ProductVariant) {
    // TODO change to productItems
    return this.inventoryService.findAll();
  }
}
