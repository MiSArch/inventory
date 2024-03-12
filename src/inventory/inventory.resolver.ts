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
import { queryKeys } from 'src/shared/utils/query.info.utils';
import { Logger } from '@nestjs/common';
import { ProductItemStatus } from 'src/shared/enums/inventory-status.enum';
import { ReserveProductItemsBatchInput } from './dto/reserve-product-items-batch.input';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { Role } from 'src/shared/enums/role.enum';

@Resolver(() => ProductItem)
export class InventoryResolver {
  constructor(
    private readonly inventoryService: InventoryService,
    // initialize logger with resolver context
    private readonly logger: Logger,
  ) {}

  @Roles(Role.EMPLOYEE, Role.SITE_ADMIN)
  @Mutation(() => [ProductItem], {
    name: 'createProductItemBatch',
    description:
      'Adds a batch of product items with the specified productVartiantId of size number',
  })
  createProductItemBatch(
    @Args('input')
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

  @Roles(Role.EMPLOYEE, Role.SITE_ADMIN)
  @Query(() => ProductItemConnection, {
    name: 'productItems',
    description: 'Retrieves all product items matching the filter',
  })
  async find(
    @Args() args: FindProductItemArgs,
    @Info() info,
  ): Promise<IPaginatedType<ProductItem>> {
    this.logger.log(`Resolving productItems for ${JSON.stringify(args)}`);

    // get query keys to avoid unnecessary workload
    const query = queryKeys(info);

    return this.inventoryService.buildConnection(query, args);
  }

  @Roles(Role.EMPLOYEE, Role.SITE_ADMIN)
  @Query(() => ProductItem, {
    name: 'productItem',
    description: 'Retrieves a product item by id',
  })
  findOne(
    @Args('id', { type: () => UUID, description: 'UUID of the user' })
    id: string,
  ) {
    this.logger.log(`Resolving findOne for ${id}`);

    return this.inventoryService.findById(id);
  }

  @Roles(Role.EMPLOYEE, Role.SITE_ADMIN)
  @Mutation(() => ProductItem, {
    name: 'updateProductItem',
    description:
      'Updates storage state, productVariant of a specific product item referenced with an Id',
  })
  updateProductItem(
    @Args('input')
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

  @Roles(Role.SITE_ADMIN)
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

  @Roles(Role.EMPLOYEE, Role.SITE_ADMIN)
  @Mutation(() => [ProductItem], {
    name: 'reserveProductItemBatch',
    description:
      'Reserves a batch of product items of a chosen product variant',
  })
  reserveProductItemBatch(
    @Args('input')
    reserveProductitemsBatch: ReserveProductItemsBatchInput,
  ) {
    this.logger.log(
      'Resolving reserveProductItemBatch for input: ',
      reserveProductitemsBatch,
    );

    return this.inventoryService.reserveProductItemBatch(
      reserveProductitemsBatch,
    );
  }

  /**
   * Resolves a reference to a ProductItem.
   *
   * @param reference - The reference object containing the typename and id.
   * @returns A Promise that resolves to the ProductItem.
   * @throws NotFoundException if the ProductItem with the given id is not found.
   */
  @Roles(Role.EMPLOYEE, Role.SITE_ADMIN)
  @ResolveReference()
  resolveReference(reference: {
    __typename: string;
    id: string;
  }): Promise<ProductItem> {
    this.logger.log(`Resolving reference for ${reference.id}`);

    return this.inventoryService.findById(reference.id);
  }

  /**
   * Resolves the product variant for a given product item.
   * @param productItem The parent product item.
   * @returns The resolved product variant.
   */
  @ResolveField()
  productVariant(@Parent() productItem: ProductItem) {
    this.logger.log(`Resolving productvariant for ${productItem}`);

    return { __typename: 'ProductVariant', id: productItem.productVariant };
  }
}
