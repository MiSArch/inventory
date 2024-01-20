import { Field, Int, ArgsType, InputType } from '@nestjs/graphql';
import { Max, Min } from 'class-validator';
import { ProductItemOrder } from './order-directions.input';

@InputType()
export class FindProductItemArgs {
  @Field(() => Int, { description: 'Number of items to skip' })
  @Min(0)
  skip = 0;
  
  @Field(() => Int, { description: 'Number of items to return' })
  @Min(1)
  first = 25;

  @Field(() => ProductItemOrder, { description: 'Ordering' })
  orderBy: ProductItemOrder;
}