import { ObjectType, Field, Directive } from '@nestjs/graphql';
import { UUID } from 'src/shared/scalars/CustomUuidScalar';
import { ProductItemConnection } from './product-item-connection.dto';

@ObjectType({ description: 'Foreign type ProductVariant' })
@Directive('@key(fields: "id")')
export class ProductVariant {
  @Field(() => UUID, {
    description: 'The uuid identifier of the product variant',
    nullable: true
  })
  id: string;
}
