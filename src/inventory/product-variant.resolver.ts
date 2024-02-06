import { Resolver, ResolveField, Parent } from '@nestjs/graphql';
import { ProductVariant } from './graphql-types/product-variant.entity';
import { InventoryService } from './inventory.service';
import { ProductItemConnection } from './graphql-types/product-item-connection.dto';
import { ProductItemOrderField } from 'src/shared/enums/product-item-order-fields.enum';
import { Logger } from '@nestjs/common';
import { ProductItemStatus } from 'src/shared/enums/inventory-status.enum';

@Resolver(() => ProductVariant)
export class ProductVariantResolver {
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly logger: Logger,  
  ) {}

  @ResolveField(() => ProductItemConnection, {description: 'A product item connection for referenced product items in stock', nullable: true})
  async productItems(@Parent() productVariant: ProductVariant): Promise<ProductItemConnection>{
    this.logger.log('Resolving Product Items for ProductVariant: ', productVariant)
    const connection = new ProductItemConnection();
    connection.nodes = await this.inventoryService.findByProductVariant({
      productVariantId: productVariant.id,
      orderBy: {
        field: ProductItemOrderField.ID,
        direction: 1,
      },
    });

    const count = await this.inventoryService.countByProductVariant(
      productVariant.id,
      ProductItemStatus.IN_STORAGE,
    );
    connection.totalCount = count;
    connection.hasNextPage = connection.nodes.length < count;
    return connection;
  }
}
