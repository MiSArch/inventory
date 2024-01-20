import { ObjectType, Field, Directive } from '@nestjs/graphql';
import { UUID } from 'src/shared/scalars/CustomUuidScalar';

@ObjectType()
@Directive('@key(fields: "_id")')
export class ProductVariant {
  @Field(() => UUID, {
    description: 'The uuid identifier of the product variant',
  })
  Id: string;
}
