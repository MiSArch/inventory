import { IsArray, IsEnum, IsOptional, IsString } from "class-validator";

/**
 * Possible Shipment Statuses
 */
export enum ShipmentStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  DELIVERED = "DELIVERED",
  FAILED = "FAILED",
}
/**
 * DTO for a shipment status update
 *
 * @property id id of the shipment
 * @property status new status of the shipment
 * @property orderId id of the order, if the shipment is created for an order
 * @property returnId id of the return, if the shipment is created for a return
 * @property orderItemIds ids of the order items that are part of the shipment
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
}