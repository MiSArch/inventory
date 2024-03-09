import { Type } from 'class-transformer';
import { IsDate, IsUUID, ValidateNested, IsArray, IsInt, Min } from 'class-validator';
import { ShipmentDTO } from './shipment.dto';
/**
 * Describes DTO of an OrderItem of an Order.
 *
 * @property id OrderItem UUID.
 * @property createdAt Timestamp when OrderItem was created.
 * @property productVariantVersionId UUID of product variant version associated with OrderItem.
 * @property productVariantId UUID of product variant associated with OrderItem.
 * @property taxRateVersionId UUID of tax rate version associated with OrderItem.
 * @property shoppingCartItemId UUID of shopping cart item associated with OrderItem.
 * @property count Specifies the quantity of the OrderItem.
 * @property compensatableAmount Total cost of product item, which can also be refunded.
 * @property shipment DTO of shipment of order item.
 * @property discountIds List of UUIDs of discounts applied to the order item.
 */
export class OrderItemDTO {
  @IsUUID()
  id: string;
  @IsDate()
  createdAt: Date;
  @IsUUID()
  productVariantVersionId: string;
  @IsUUID()
  productVariantId: string;
  @IsUUID()
  taxRateVersionId: string;
  @IsUUID()
  shoppingCartItemId: string;
  @IsInt()
  @Min(1)
  count: number;
  @IsInt()
  @Min(0)
  compensatableAmount: number;
  @ValidateNested()
  @Type(() => ShipmentDTO)
  shipment: ShipmentDTO;
  @IsArray()
  @IsUUID("4", { each: true })
  discountIds: string[];
}