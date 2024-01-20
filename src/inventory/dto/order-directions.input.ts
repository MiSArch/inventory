import { InputType, Field } from '@nestjs/graphql';
import { OrderDirection } from 'src/shared/enums/order-direction.enum';
import { ProductItemOrderField } from 'src/shared/enums/product-item-order-fields.enum';

@InputType()
export class ProductItemOrder {
  @Field(() => ProductItemOrderField, { description: 'The field to order by' })
  field: ProductItemOrderField;

  @Field(() => OrderDirection, { description: 'The direction to order by' })
  direction: OrderDirection;
}