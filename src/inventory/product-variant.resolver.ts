import { Resolver, ResolveField, Parent, Info, Args } from '@nestjs/graphql';
import { ProductVariant } from './graphql-types/product-variant.entity';
import { InventoryService } from './inventory.service';
import { ProductItemConnection } from './graphql-types/product-item-connection.dto';
import { Logger } from '@nestjs/common';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { Role } from 'src/shared/enums/role.enum';
import { queryKeys } from 'src/shared/utils/query.info.utils';
import { ProductItemStatus } from 'src/shared/enums/inventory-status.enum';
import { FindProductItemsByProductVariantArgs } from './dto/find-product-items-by-product-variant.input';

@Resolver(() => ProductVariant)
export class ProductVariantResolver {
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly logger: Logger,
  ) {}

  @Roles(Role.EMPLOYEE, Role.SITE_ADMIN)
  @ResolveField(() => ProductItemConnection, {
    description:
      'A product item connection for referenced product items in stock',
    nullable: true,
  })
  async productItems(
    @Parent() productVariant: ProductVariant,
    @Args() args: FindProductItemsByProductVariantArgs,
    @Info() info,
  ): Promise<ProductItemConnection> {
    this.logger.log(
      `Resolving Product Items for ProductVariant: ${JSON.stringify(
        productVariant,
      )}`,
    );

    // get query keys to avoid unnecessary workload
    const query = queryKeys(info);
    // filter for correct product variant
    const filter = { productVariant: productVariant.id };

    return this.inventoryService.buildConnection(query, { ...args, filter });
  }

  @Roles(Role.BUYER, Role.EMPLOYEE, Role.SITE_ADMIN)
  @ResolveField(() => Number, {
    description: 'The number of product items in stock',
  })
  async inventoryCount(
    @Parent() productVariant: ProductVariant,
  ): Promise<Number> {
    this.logger.log(
      `Resolving Inventory Count for ProductVariant: ${JSON.stringify(
        productVariant,
      )}`,
    );

    return this.inventoryService.count({
      productVariant: productVariant.id,
      inventoryStatus: ProductItemStatus.IN_STORAGE,
    });
  }
}
