import { InputType, Field } from '@nestjs/graphql';
import { UUID } from 'src/shared/scalars/CustomUuidScalar';

@InputType({ description: 'The input to reserve a batch of product items'})
export class ReserveProductItemsBatchInput {
  @Field(() => UUID, {
    description: 'The product variant id of the product item',
  })
  productVariantId: string;

  @Field(() => Number, {
    description: 'The number of product items to reserve',
  })
  number: number;
}