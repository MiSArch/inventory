import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { InventoryService } from './inventory.service';
import { Inventory } from './entities/inventory.entity';
import { CreateInventoryInput } from './dto/create-inventory.input';
import { UpdateInventoryInput } from './dto/update-inventory.input';
import { UUID } from 'src/shared/scalars/CustomUuidScalar';

@Resolver(() => Inventory)
export class InventoryResolver {
  constructor(private readonly inventoryService: InventoryService) {}

  @Mutation(() => Inventory)
  createInventory(
    @Args('createInventoryInput') createInventoryInput: CreateInventoryInput,
  ) {
    return this.inventoryService.create(createInventoryInput);
  }

  @Query(() => [Inventory], { name: 'allInventories' })
  findAll() {
    return this.inventoryService.findAll();
  }

  @Query(() => Int, { name: 'countProductInventory' })
  countByProductVariantId(
    @Args('productVersionId', { type: () => UUID }) productVersionId: string,
  ) {
    return this.inventoryService.countByProductVariantId(productVersionId);
  }

  @Query(() => Inventory, { name: 'inventory' })
  findOne(@Args('_id', { type: () => UUID }) _id: string) {
    return this.inventoryService.findOne(_id);
  }

  @Mutation(() => Inventory)
  updateInventory(
    @Args('updateInventoryInput')
    updateInventoryInput: UpdateInventoryInput,
  ) {
    return this.inventoryService.update(
      updateInventoryInput._id,
      updateInventoryInput,
    );
  }

  @Mutation(() => Inventory)
  removeInventory(@Args('_id', { type: () => UUID }) _id: string) {
    return this.inventoryService.remove(_id);
  }
}
