import { Resolver, ResolveField, Parent } from '@nestjs/graphql';
import { ProductVariant } from './graphql-types/product-variant.entity';
import { InventoryService } from './inventory.service';
import { Inventory } from './entities/inventory.entity';

@Resolver(() => ProductVariant)
export class UsersResolver {
  constructor(private readonly inventoryService: InventoryService) {}

  @ResolveField(() => [Inventory])
  posts(@Parent() productVariant: Inventory): Inventory[] {
    // TODO change to productItems
    return this.inventoryService.findAll();
  }
}
