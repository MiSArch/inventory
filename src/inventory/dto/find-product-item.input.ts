import { Field, Int, ArgsType, InputType } from '@nestjs/graphql';
import { Max, Min } from 'class-validator';

@InputType()
export class FindProductItemArgs {
  @Field(() => Int)
  @Min(0)
  skip = 0;
  
  @Field(() => Int)
  @Min(1)
  take = 25;
}