import {
  Resolver,
  Query,
  Mutation,
  Args,
  Info,
  ResolveReference,
  ResolveField,
  Parent,
} from '@nestjs/graphql';

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
import { FindProductItemsByProductVariantArgs } from './dto/find-product-item-by-product-version-id.args';
import { Logger } from '@nestjs/common';

@Resolver(() => ProductItem)
export class InventoryResolver {
  constructor(
    private readonly inventoryService: InventoryService,
    // initialize logger with resolver context
    private readonly logger: Logger,
  ) {}

  @Mutation(() => [ProductItem], {
    name: 'createProductItemBatch',
    description:
      'Adds a batch of product items with the specified productVartiantId of size number',
  })
  createProductItemBatch(
    @Args('createProductItemBatchInput')
    createProductItemBatchInput: CreateProductItemBatchInput,
  ) {
    this.logger.log(
      `Resolving createProductItemBatch for ${JSON.stringify(
        createProductItemBatchInput,
      )}`,
    );

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
    this.logger.log(`Resolving productItems for ${JSON.stringify(args)}`);
    const { first, skip } = args;

    // get query keys to avoid unnecessary workload
    const query = queryKeys(info);
    let connection = new ProductItemConnection();
    if (query.includes('nodes')) {
      // default order is ascending by id
      if (!args.orderBy) {
        args.orderBy = {
          field: ProductItemOrderField.ID,
          direction: 1,
        };
      }

      // get nodes according to args
      connection.nodes = await this.inventoryService.findAll(args);
    }

    if (query.includes('totalCount') || query.includes('hasNextPage')) {
      const totalCount = await this.inventoryService.getCount();

      connection.totalCount = totalCount;
      connection.hasNextPage = skip + first < totalCount;
    }

    return connection;
  }

  @Query(() => ProductItemConnection, {
    name: 'productItemsByProductVariantId',
    description:
      'Returns product items in inventory of a product variant version',
  })
  async findByProductVariantId(
    @Args() args: FindProductItemsByProductVariantArgs,
    @Info() info,
  ) {
    this.logger.log(
      `Resolving productItemsByProductVariant for ${JSON.stringify(args)}`,
    );
    const { first, skip, productVariantId } = args;

    // get query keys to avoid unnecessary workload
    const query = queryKeys(info);
    let connection = new ProductItemConnection();

    if (query.includes('nodes')) {
      // default order is ascending by id
      if (!args.orderBy) {
        args.orderBy = {
          field: ProductItemOrderField.ID,
          direction: 1,
        };
      }

      // get nodes according to args
      connection.nodes =
        await this.inventoryService.findByProductVariantId(args);
    }

    if (query.includes('totalCount') || query.includes('hasNextPage')) {
      connection.totalCount =
        await this.inventoryService.countByProductVariantId(productVariantId);
      connection.hasNextPage = skip + first < connection.totalCount;
    }
    return connection;
  }

  @Query(() => ProductItem, {
    name: 'productItem',
    description: 'Retrieves a product item by id',
  })
  findOne(
    @Args('id', { type: () => UUID, description: 'UUID of the user' })
    id: string,
  ) {
    this.logger.log(`Resolving findOne for ${id}`);

    return this.inventoryService.findOne(id);
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
    this.logger.log(
      `Resolving updateProductItem for ${JSON.stringify(
        updateProductItemInput,
      )}`,
    );

    return this.inventoryService.update(
      updateProductItemInput.id,
      updateProductItemInput,
    );
  }

  @Mutation(() => ProductItem, {
    name: 'deleteProductItem',
    description: 'Deletes a product item by id',
  })
  deleteProductItem(
    @Args('id', {
      type: () => UUID,
      description: 'UUID of product item to delete',
    })
    id: string,
  ) {
    this.logger.log(`Resolving deleteProductItem for${id}`);

    return this.inventoryService.delete(id);
  }

  @ResolveReference()
  resolveReference(reference: {
    __typename: string;
    id: string;
  }): Promise<ProductItem> {
    this.logger.log(`Resolving reference for ${reference.id}`);

    return this.inventoryService.findOne(reference.id);
  }

  @ResolveField()
  productVariant(@Parent() productItem: ProductItem) {
    this.logger.log(`Resolving productvariant for ${productItem}`);

    return { __typename: 'ProductVariant', id: productItem.productVariant };
  }
}
