import { Resolver, ResolveField, Parent } from '@nestjs/graphql';
import { ProductVariant } from './graphql-types/product-variant.entity';
import { InventoryService } from './inventory.service';
import { ProductItemConnection } from './graphql-types/product-item-connection.dto';
import { ProductItemOrderField } from 'src/shared/enums/product-item-order-fields.enum';

@Resolver(() => ProductVariant)
export class ProductVariantResolver {
  constructor(private readonly inventoryService: InventoryService) {}

  @ResolveField(() => ProductItemConnection, {description: 'A product item connection for referenced product items in stock', nullable: true})
  async productItems(@Parent() productVariant: ProductVariant): Promise<ProductItemConnection>{
    console.log('Resolving Product Items for ProductVariant:', productVariant)
    const connection = new ProductItemConnection();
    connection.nodes = await this.inventoryService.findByProductVariant({
      productVariant: productVariant.id,
      orderBy: {
        field: ProductItemOrderField.ID,
        direction: 1,
      },
    });

    const count = await this.inventoryService.countByProductVariant(productVariant.id);
    connection.totalCount = count;
    connection.hasNextPage = connection.nodes.length < count;
    return connection;
  }
}
