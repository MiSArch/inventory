import { InputType, Field } from '@nestjs/graphql';
import { ProductItemStatus } from 'src/shared/enums/inventory-status.enum';
import { UUID } from 'src/shared/scalars/CustomUuidScalar';

@InputType({ description: 'Filtering options for product items' })
export class ProductItemFilter {
  @Field(() => UUID, {
    description: 'Linked product variant id',
    nullable: true,
  })
  productVariant?: string;

  @Field(() => ProductItemStatus, {
    description: 'Current product item status',
    nullable: true,
  })
  inventoryStatus?: ProductItemStatus;
}
