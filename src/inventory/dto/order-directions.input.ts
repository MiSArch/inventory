import { InputType, Field } from '@nestjs/graphql';
import { OrderDirection } from 'src/shared/enums/order-direction.enum';
import { ProductItemOrderField } from 'src/shared/enums/product-item-order-fields.enum';

@InputType({ description: 'Ordering options for product items'})
export class ProductItemOrder {
  @Field(() => ProductItemOrderField, {
    description: 'The field to order by',
    nullable: true,
  })
  field: ProductItemOrderField = ProductItemOrderField.ID;

  @Field(() => OrderDirection, { description: 'The direction to order by' })
  direction: OrderDirection = OrderDirection.ASC;

  constructor(
    field: ProductItemOrderField = ProductItemOrderField.ID,
    direction: OrderDirection = OrderDirection.ASC,
  ) {
    this.field = field;
    this.direction = direction;
  }
}
