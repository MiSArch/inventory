import { ObjectType, Field, Directive } from '@nestjs/graphql';
import { UUID } from 'src/shared/scalars/CustomUuidScalar';
import { v4 as uuidv4 } from 'uuid';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ProductVariant } from '../graphql-types/product-variant.entity';
import { ProductItemStatus } from 'src/shared/enums/inventory-status.enum';

@ObjectType({ description: 'A product Item of a product variant' })
@Schema({
  versionKey: false,
  id: false,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
@Directive('@key(fields: "id")')
export class ProductItem {
  // _id is required by mongoose and used in all non-graphql contexts (services, etc.)
  @Prop({ required: true, default: uuidv4 })
  _id: string;

  // id is the graphql id and is used in all graphql contexts (resolvers, etc.)
  @Field(() => UUID, { description: 'The uuid identifier of the product item' })
  get id(): string {
    return this._id;
  }

  @Prop({ required: true })
  @Field(() => ProductVariant, {
    description: 'The corresponding product variant',
  })
  productVariant: ProductVariant;

  @Prop({ required: true, default: ProductItemStatus.IN_STORAGE })
  @Field(() => ProductItemStatus, {
    description: 'Describes the inventory status of the product item',
  })
  inventoryStatus: ProductItemStatus;

  @Prop()
  @Field(() => UUID, {
    nullable: true,
    description: 'Reference to the order that reserved the product item',
  })
  orderId?: string;
}

export const ProductItemSchema = SchemaFactory.createForClass(ProductItem);

// virtual id field to get around mongoose _id restrictions and keep constistency with other services
ProductItemSchema.virtual('id').get(function () {
  return this._id;
});
