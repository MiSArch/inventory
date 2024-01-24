import { Field, Int, ArgsType } from '@nestjs/graphql';
import { Max, Min } from 'class-validator';
import { ProductItemOrder } from './order-directions.input';
import { MAX_INT32 } from 'src/shared/constants/constants';
import { UUID } from 'src/shared/scalars/CustomUuidScalar';

@ArgsType()
export class FindProductItemsByProductVariantArgs {
  @Field(() => UUID, { description: 'UUID of product variant for stock count' })
  productVariantId: string;
  @Field(() => Int, {
    description: 'Number of items to skip',
    nullable: true,
  })
  @Min(0)
  skip?: number = 0;

  @Field(() => Int, {
    description: 'Number of items to return',
    nullable: true,
  })
  @Min(1)
  first?: number = MAX_INT32;

  @Field(() => ProductItemOrder, { description: 'Ordering', nullable: true })
  orderBy?: ProductItemOrder;
}