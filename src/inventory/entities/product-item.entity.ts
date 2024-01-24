import { ObjectType, Field } from '@nestjs/graphql';
import { UUID } from 'src/shared/scalars/CustomUuidScalar';
import { v4 as uuidv4 } from 'uuid';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@ObjectType({ description: 'A product Item of a product variant' })
@Schema({
  versionKey: false,
  id: false,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class ProductItem {
  @Prop({ required: true, default: uuidv4 })
  _id: string;

  @Field(() => UUID, { description: 'The uuid identifier of the product item' })
  get id(): string {
    return this._id;
  }

  @Prop({ required: true })
  @Field(() => UUID, {
    description: 'The uuid identifier of the corresponding product variant',
  })
  productVariantId: string;

  @Prop({ required: true, default: true })
  @Field(() => Boolean, {
    description: 'Describes if the product item is still in storage',
  })
  isInInventory: boolean;
}

export const ProductItemSchema = SchemaFactory.createForClass(ProductItem);

ProductItemSchema.virtual('id').get(function () {
  return this._id;
});
