import { ObjectType, Field } from '@nestjs/graphql';
import { UUID } from 'src/shared/scalars/CustomUuidScalar';
import { v4 as uuidv4 } from 'uuid';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@ObjectType()
@Schema({ versionKey: false, id: false })
export class Inventory {
  @Prop({ required: true, default: uuidv4 })
  @Field(() => UUID, { description: 'The uuid identifier of the inventory' })
  _id: string;

  @Prop({ required: true })
  @Field(() => UUID, {
    description: 'The uuid identifier of the corresponding product variant',
  })
  productVariantId: string;

  @Prop({ required: true, default: true })
  @Field(() => Boolean, {
    description: 'Describes if the inventory is still in storage',
  })
  isInInventory: boolean;
}

export const InventorySchema = SchemaFactory.createForClass(Inventory);
