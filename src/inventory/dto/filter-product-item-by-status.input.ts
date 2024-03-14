import { InputType, Field } from '@nestjs/graphql';
import { ProductItemStatus } from 'src/shared/enums/inventory-status.enum';

@InputType({ description: 'Filtering options for product items of product variants' })
export class ProductItemOfProductVariantFilter {
  @Field(() => ProductItemStatus, {
    description: 'Current product item status',
    nullable: true,
  })
  inventoryStatus?: ProductItemStatus;
}
