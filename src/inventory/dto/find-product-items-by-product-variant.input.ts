import { Field, Int, ArgsType } from '@nestjs/graphql';
import { Min } from 'class-validator';
import { ProductItemOrder } from './order-directions.input';
import { MAX_INT32 } from 'src/shared/constants/constants';
import { ProductItemOfProductVariantFilter } from './filter-product-item-by-status.input';
import { ProductItemOrderField } from 'src/shared/enums/product-item-order-fields.enum';
import { OrderDirection } from 'src/shared/enums/order-direction.enum';

/**
 * Arguments for finding product items by product variant.
 */
@ArgsType()
export class FindProductItemsByProductVariantArgs {
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
  orderBy?: ProductItemOrder;

  @Field(() => ProductItemOfProductVariantFilter, {
    description: 'Filtering',
    nullable: true,
  })
  filter?: ProductItemOfProductVariantFilter;
}