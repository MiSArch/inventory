import { Resolver, Query, Mutation, Args, Int, Info } from '@nestjs/graphql';
import { InventoryService } from './inventory.service';
import { ProductItem } from './entities/product-item.entity';
import { CreateProductItemBatchInput } from './dto/create-product-item-batch.input';
import { UpdateProductItemInput } from './dto/update-product-item.input';
import { UUID } from 'src/shared/scalars/CustomUuidScalar';
import { FindProductItemArgs } from './dto/find-product-item.input';
import { IPaginatedType } from 'src/shared/interfaces/pagination.interface';
import { ProductItemConnection } from 'src/inventory/graphql-types/product-item-connection.dto';
import { ProductItemOrderField } from 'src/shared/enums/product-item-order-fields.enum';
import { queryKeys } from 'src/shared/utils/query.info.utils';

@Resolver(() => ProductItem)
export class InventoryResolver {
  constructor(private readonly inventoryService: InventoryService) {}

  @Mutation(() => [ProductItem], {
    name: 'createProductItemBatch',
    description:
      'Adds a batch of product items with the specified productVartiantId of size number',
  })
  createProductItemBatch(
    @Args('createProductItemBatchInput')
    createProductItemBatchInput: CreateProductItemBatchInput,
  ) {
    return this.inventoryService.createProductItemBatch(
      createProductItemBatchInput,
    );
  }

  @Query(() => ProductItemConnection, {
    name: 'productItems',
    description: 'Retrieves all product items',
  })
  async findAll(
    @Args() args: FindProductItemArgs,
    @Info() info,
  ): Promise<IPaginatedType<ProductItem>> {
    if (!args.orderBy) {
      args.orderBy = {
        field: ProductItemOrderField.ID,
        direction: 1,
      };
    }

    // get query keys to avoid unnecessary workload
    const query = queryKeys(info);
    let connection = new ProductItemConnection();
    if (query.includes('nodes')) {
      connection.nodes = await this.inventoryService.findAll(args);
    }

    if (query.includes('totalCount') || query.includes('hasNextPage')) {
      const totalCount = await this.inventoryService.getCount();

      connection.totalCount = totalCount;
      connection.hasNextPage = args.skip + args.first < totalCount;
    }

    return connection;
  }

  @Query(() => Int, {
    name: 'countProductItems',
    description:
      'Counts all product items in inventory of a product variant version',
  })
  countByProductVariantId(
    @Args('productVersionId', {
      type: () => UUID,
      description: 'UUID of product variant for stock count',
    })
    productVersionId: string,
  ) {
    return this.inventoryService.countByProductVariantId(productVersionId);
  }

  @Query(() => ProductItem, {
    name: 'productItem',
    description: 'Retrieves a product item by id',
  })
  findOne(
    @Args('_id', { type: () => UUID, description: 'UUID of the user' })
    _id: string,
  ) {
    return this.inventoryService.findOne(_id);
  }

  @Mutation(() => ProductItem, {
    name: 'updateProductItem',
    description:
      'Updates storage state, productVariantId of a specific product item referenced with an Id',
  })
  updateProductItem(
    @Args('updateProductItemInput')
    updateProductItemInput: UpdateProductItemInput,
  ) {
    return this.inventoryService.update(
      updateProductItemInput._id,
      updateProductItemInput,
    );
  }

  @Mutation(() => ProductItem, {
    name: 'deleteProductItem',
    description: 'Deletes a product item by id',
  })
  deleteProductItem(
    @Args('_id', {
      type: () => UUID,
      description: 'UUID of product item to delete',
    })
    _id: string,
  ) {
    return this.inventoryService.delete(_id);
  }
}
