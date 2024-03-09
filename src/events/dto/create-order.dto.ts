import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, ValidateNested, IsArray, IsInt, Min } from 'class-validator';

/**
 * Enum representing the status of an order.
 */
export enum OrderStatus {
  // The order is pending and has not been placed yet.
  PENDING = 'PENDING',
  // The order has been placed.
  PLACED = 'PLACED',
  // The order has been rejected.
  REJECTED = 'REJECTED',
}

/**
 * Enum representing the possible reasons for rejecting an order.
 */
export enum RejectionReason {
  // The order was rejected since data was invalid.
  INVALID_ORDER_DATA = 'INVALID_ORDER_DATA',
  // The order was rejected since the product item reservation failed.
  INVENTORY_RESERVATION_FAILED = 'INVENTORY_RESERVATION_FAILED',
}

/**
 * Enum representing the status of a shipment.
 */
enum ShipmentStatus {
  // The shipment is pending.
  PENDING = 'PENDING',
  // The shipment is in progress.
  IN_PROGRESS = 'IN_PROGRESS',
  // The shipment has been delivered.
  DELIVERED = 'DELIVERED',
  // The shipment has failed.
  FAILED = 'FAILED',
}

/**
 * DTO representing a shipment.
 */
export class ShipmentDTO {
  // The status of the shipment.
  @IsEnum(ShipmentStatus)
  status: ShipmentStatus;

  // The UUID of the used shipment method.
  @IsUUID()
  shipmentMethodId: string;


}

/**
 * DTO representing an order.
 */
export class OrderDTO {
  // The UUID of the order.
  @IsUUID()
  id: string;

  // The UUID of the user who placed the order.
  @IsUUID()
  userId: string;

  // The creation date of the order.
  @IsDate()
  createdAt: Date;

  // The current status of the order.
  @IsEnum(OrderStatus)
  orderStatus: OrderStatus;

  // The date the order was placed.
  @IsOptional()
  @IsDate()
  placedAt?: Date;

  // The reason of rejection, if an order was rejected.
  @IsOptional()
  @IsEnum(RejectionReason)
  rejectionReason?: RejectionReason;

  // The UUID of the connected shipment address.
  @IsUUID()
  shipmentAddressId: string;

  // The UUID of the connected invoice address.
  @IsUUID()
  invoiceAddressId: string;

  // The included order items.
  @ValidateNested({ each: true })
  @Type(() => OrderItemDTO)
  @IsArray()
  orderItems: OrderItemDTO[];
}

/**
 * DTO representing an order item.
 */
export class OrderItemDTO {
  // The UUID of the order item.
  @IsUUID()
  id: string;

  // The creation date of the order item.
  @IsDate()
  createdAt: Date;

  // The UUID of the items product variant version.
  @IsUUID()
  productVariantVersionId: string;

  // The UUID of the items product variant.
  @IsUUID()
  productVariantId: string;

  // The UUID of the items tax rate version.
  @IsUUID()
  taxRateVersionId: string;

  // The UUID of the original shopping cart item.
  @IsUUID()
  shoppingCartItemId: string;

  // The ordered count of the product Variant Version.
  @IsInt()
  @Min(1)
  count: number;

  // The amount to be compensated for this order item in case of a return.
  @IsInt()
  @Min(0)
  compensatableAmount: number;

  // The shipment for the order item.
  @ValidateNested()
  @Type(() => ShipmentDTO)
  shipment: ShipmentDTO;

  // The UUIDs of the discounts applied to the order item.
  @IsArray()
  @IsUUID("4", { each: true })
  discountIds: string[];
}

/**
 * DTO representing a create order event payload.
 */
export class CreateOrderDto {
  // The order data.
  @ValidateNested()
  @Type(() => OrderDTO)
  order: OrderDTO;
}