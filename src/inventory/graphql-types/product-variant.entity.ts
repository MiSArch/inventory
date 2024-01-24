import { ObjectType, Field, Directive } from '@nestjs/graphql';
import { UUID } from 'src/shared/scalars/CustomUuidScalar';

@ObjectType({ description: 'Foreign type ProductVariant' })
@Directive('@key(fields: "id")')
export class ProductVariant {
  @Field(() => UUID, {
    description: 'The uuid identifier of the product variant',
  })
  id: string;
}
