import { UUID } from 'src/shared/scalars/CustomUuidScalar';
import { CreateInventoryInput } from './create-inventory.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateInventoryInput extends PartialType(CreateInventoryInput) {
  @Field(() => UUID)
  id: string;
}
