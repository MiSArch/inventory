import { InputType, Field } from '@nestjs/graphql';
import { UUID } from 'src/shared/scalars/CustomUuidScalar';

@InputType({ description: 'The input of a product item update'})
export class UpdateProductItemInput {
  @Field(() => UUID, {
    description: 'The product item identifier',
  })
  id: string;

  @Field(() => UUID, {
    description: 'The product variant id of the product item',
  })
  productVariantId: string;

  @Field(() => Boolean, {
    description: 'The inventory state of the product item',
  })
  isInInventory: boolean;
}
