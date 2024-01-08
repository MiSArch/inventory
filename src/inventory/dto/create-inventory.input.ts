import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateInventoryInput {
  @Field(() => String, { description: 'The name of the inventory' })
  name: string;

  @Field(() => String, { description: 'The description of the inventory' })
  description: string;
}
