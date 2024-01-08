import { InputType, Field } from '@nestjs/graphql';
import { UUID } from 'src/shared/scalars/CustomUuidScalar';

@InputType()
export class CreateInventoryInput {
  @Field(() => UUID, {
    description: 'The product variant id of the inventory',
  })
  productVariantId: string;

  @Field(() => Number, {
    description: 'The number of products to add',
  })
  number: number;
}
