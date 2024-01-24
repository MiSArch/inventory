import { Field, Int, ArgsType } from '@nestjs/graphql';
import { Max, Min } from 'class-validator';
import { ProductItemOrder } from './order-directions.input';
import { MAX_INT32 } from 'src/shared/constants/constants';

@ArgsType()
export class FindProductItemArgs {
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
  orderBy: ProductItemOrder;
}
