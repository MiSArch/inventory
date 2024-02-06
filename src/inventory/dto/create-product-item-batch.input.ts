import { InputType, Field } from '@nestjs/graphql';
import { UUID } from 'src/shared/scalars/CustomUuidScalar';

@InputType({ description: 'The input of a product item batch creation' })
export class CreateProductItemBatchInput {
  @Field(() => UUID, {
    description: 'The product variant id of the product item',
  })
  productVariant: string;

  @Field(() => Number, {
    description: 'The number of products to add',
  })
  number: number;
}
