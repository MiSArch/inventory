import { ObjectType, Field } from '@nestjs/graphql';
import { UUID } from 'src/shared/scalars/CustomUuidScalar';
import { Schema, SchemaFactory } from '@nestjs/mongoose';

@ObjectType()
@Schema()
export class Inventory {
  @Field(() => UUID, { description: 'The uuid identifier of the inventory' })
  id: string;

  @Field(() => String, { description: 'The name of the inventory' })
  name: string;

  @Field(() => String, { description: 'The description of the inventory' })
  description: string;
}

export const InventorySchema = SchemaFactory.createForClass(Inventory);
