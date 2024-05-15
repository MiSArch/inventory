import { IsArray, IsEnum, IsOptional, IsString } from "class-validator";

/**
 * Possible Shipment Statuses
 */
export enum ShipmentStatus {
  PENDING,
  IN_PROGRESS,
  DELIVERED,
  FAILED
}
/**
 * Entity for the shipment created event
 * 
 * @property id id of the shipment
 * @property orderId id of the order, if the shipment is created for an order
 * @property returnId id of the return, if the shipment is created for a return
 * @property status status of the shipment (always PENDING)
 * @property orderItemIds ids of the order items that are part of the shipment
 * @property shipmentMethodId id of the shipment method
 */
export class ShipmentStatusUpdatedDto {
  @IsString()
  id: string;
  @IsString()
  @IsOptional()
  orderId?: string;
  @IsString()
  @IsOptional()
  returnId?: string;
  @IsEnum(ShipmentStatus)
  status: ShipmentStatus;
  @IsArray()
  orderItemIds: string[];
  @IsString()
  shipmentMethodId: string;
  @IsString()
  shipmentAddressId: string;
}