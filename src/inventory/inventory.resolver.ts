import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { InventoryService } from './inventory.service';
import { ProductItem } from './entities/product-item.entity';
import { CreateProductItemBatchInput } from './dto/create-product-item-batch.input';
import { UpdateProductItemInput } from './dto/update-product-item.input';
import { UUID } from 'src/shared/scalars/CustomUuidScalar';

@Resolver(() => ProductItem)
export class InventoryResolver {
  constructor(private readonly inventoryService: InventoryService) {}

  @Mutation(() => [ProductItem])
  createProductItemBatch(
    @Args('createProductItemBatchInput')
    createProductItemBatchInput: CreateProductItemBatchInput,
  ) {
    return this.inventoryService.createProductItemBatch(
      createProductItemBatchInput,
    );
  }

  @Query(() => [ProductItem], { name: 'productItems' })
  findAll() {
    return this.inventoryService.findAll();
  }

  @Query(() => Int, { name: 'countProductItems' })
  countByProductVariantId(
    @Args('productVersionId', { type: () => UUID }) productVersionId: string,
  ) {
    return this.inventoryService.countByProductVariantId(productVersionId);
  }

  @Query(() => ProductItem, { name: 'productItem' })
  findOne(@Args('_id', { type: () => UUID }) _id: string) {
    return this.inventoryService.findOne(_id);
  }

  @Mutation(() => ProductItem)
  updateProductItem(
    @Args('updateProductItemInput')
    updateProductItemInput: UpdateProductItemInput,
  ) {
    return this.inventoryService.update(
      updateProductItemInput._id,
      updateProductItemInput,
    );
  }

  @Mutation(() => ProductItem)
  removeProductItem(@Args('_id', { type: () => UUID }) _id: string) {
    return this.inventoryService.remove(_id);
  }
}
