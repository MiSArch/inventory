import { InputType, Field } from '@nestjs/graphql';
import { UUID } from 'src/shared/scalars/CustomUuidScalar';

@InputType()
export class UpdateProductItemInput {
  @Field(() => UUID, {
    description: 'The product item identifier',
  })
  _id: string;

  @Field(() => UUID, {
    description: 'The product variant id of the product item',
  })
  productVariantId: string;

  @Field(() => Boolean, {
    description: 'The inventory state of the product item',
  })
  isInInventory: boolean;
}