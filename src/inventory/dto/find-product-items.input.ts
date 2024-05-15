import { Field, Int, ArgsType } from '@nestjs/graphql';
import { Min } from 'class-validator';
import { ProductItemOrder } from './order-directions.input';
import { MAX_INT32 } from 'src/shared/constants/constants';
import { ProductItemFilter } from './filter-product-item.input';
import { ProductItemOrderField } from 'src/shared/enums/product-item-order-fields.enum';

/**
 * Arguments for finding product items.
 */
@ArgsType()
export class FindProductItemsArgs {
  @Field(() => Int, {
    description: 'Number of items to skip',
    nullable: true,
  })
  @Min(0)
  skip: number = 0;

  @Field(() => Int, {
    description: 'Number of items to return',
    nullable: true,
  })
  @Min(1)
  first: number = MAX_INT32;

  @Field(() => ProductItemOrder, { description: 'Ordering', nullable: true })
  // default order is ascending by id
  orderBy: ProductItemOrder = { field: ProductItemOrderField.ID, direction: 1 };

  @Field(() => ProductItemFilter, {
    description: 'Filtering',
    nullable: true,
  })
  filter?: ProductItemFilter;
}
