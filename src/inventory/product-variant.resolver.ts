import { Resolver, ResolveField, Parent, Info } from '@nestjs/graphql';
import { ProductVariant } from './graphql-types/product-variant.entity';
import { InventoryService } from './inventory.service';
import { ProductItemConnection } from './graphql-types/product-item-connection.dto';
import { Logger } from '@nestjs/common';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { Role } from 'src/shared/enums/role.enum';
import { FindProductItemArgs } from './dto/find-product-item.input';
import { queryKeys } from 'src/shared/utils/query.info.utils';
import { ProductItemStatus } from 'src/shared/enums/inventory-status.enum';

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
    @Info() info,
  ): Promise<ProductItemConnection> {
    this.logger.log(
      `Resolving Product Items for ProductVariant: ${JSON.stringify(
        productVariant,
      )}`,
    );

    // get query keys to avoid unnecessary workload
    const query = queryKeys(info);
    // build default FindProductItemArgs
    const args = new FindProductItemArgs();
    // filter for correct product variant
    args.filter = { productVariant: productVariant.id };

    return this.inventoryService.buildConnection(query, args);
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
