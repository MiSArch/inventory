import { IsEnum, IsUUID } from "class-validator";
import { ShipmentStatus } from "./shipment-status";

/**
 * DTO of a shipment associated with one or more order items.
 *
 * @property status Shipment status of the shipment.
 * @property shipmentMethodId UUID of method/provider, which is used for shipping.
 */
export class ShipmentDTO {
  @IsEnum(ShipmentStatus)
  status: ShipmentStatus;
  @IsUUID()
  shipmentMethodId: string;
}