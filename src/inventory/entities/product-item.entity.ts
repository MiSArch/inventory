import { ObjectType, Field, Directive } from '@nestjs/graphql';
import { UUID } from 'src/shared/scalars/CustomUuidScalar';
import { v4 as uuidv4 } from 'uuid';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ProductVariant } from '../graphql-types/product-variant.entity';

@ObjectType({ description: 'A product Item of a product variant' })
@Schema({
  versionKey: false,
  id: false,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
@Directive('@key(fields: "_id")')
export class ProductItem {
  @Prop({ required: true, default: uuidv4 })
  _id: string;

  @Field(() => UUID, { description: 'The uuid identifier of the product item' })
  get id(): string {
    return this._id;
  }

  @Prop({ required: true })
  @Field(() => ProductVariant, {
    description: 'The corresponding product variant',
  })
  productVariant: ProductVariant;

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
