import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { InventoryService } from './inventory.service';
import { Inventory } from './entities/inventory.entity';
import { CreateInventoryInput } from './dto/create-inventory.input';
import { UpdateInventoryInput } from './dto/update-inventory.input';
import { UUID } from 'src/shared/scalars/CustomUuidScalar';

@Resolver(() => Inventory)
export class InventoryResolver {
  constructor(private readonly inventoryService: InventoryService) {}

  @Mutation(() => Inventory)
  createCategory(
    @Args('createCategoryInput') createCategoryInput: CreateInventoryInput,
  ) {
    return this.inventoryService.create(createCategoryInput);
  }

  @Query(() => [Inventory], { name: 'category' })
  findAll() {
    return this.inventoryService.findAll();
  }

  @Query(() => Inventory, { name: 'category' })
  findOne(@Args('id', { type: () => UUID }) id: string) {
    return this.inventoryService.findOne(id);
  }

  @Mutation(() => Inventory)
  updateCategory(
    @Args('updateCategoryInput')
    updateCategoryInput: UpdateInventoryInput,
  ) {
    return this.inventoryService.update(
      updateCategoryInput.id,
      updateCategoryInput,
    );
  }

  @Mutation(() => Inventory)
  removeCategory(@Args('id', { type: () => UUID }) id: string) {
    return this.inventoryService.remove(id);
  }
}
