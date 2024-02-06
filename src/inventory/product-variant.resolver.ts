import { Resolver, ResolveField, Parent } from '@nestjs/graphql';
import { ProductVariant } from './graphql-types/product-variant.entity';
import { InventoryService } from './inventory.service';
import { ProductItemConnection } from './graphql-types/product-item-connection.dto';
import { Logger } from '@nestjs/common';

@Resolver(() => ProductVariant)
export class ProductVariantResolver {
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly logger: Logger,  
  ) {}

  @ResolveField(() => ProductItemConnection, {description: 'A product item connection for referenced product items in stock', nullable: true})
  async productItems(@Parent() productVariant: ProductVariant): Promise<ProductItemConnection>{
    this.logger.log('Resolving ProductVariant for ', productVariant)
    const connection = new ProductItemConnection();
    connection.nodes = await this.inventoryService.findByProductVariantId({ productVariantId: productVariant.id });
    return connection;
  }
}
