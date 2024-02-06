import { ObjectType, Field, Directive } from '@nestjs/graphql';
import { UUID } from 'src/shared/scalars/CustomUuidScalar';
import { v4 as uuidv4 } from 'uuid';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@ObjectType({ description: 'A product Item of a product variant' })
@Schema()
export class ProductVariantStub {
  @Prop({ required: true, default: uuidv4 })
  _id: string;
}

export const ProductVariantStubSchema = SchemaFactory.createForClass(ProductVariantStub);
