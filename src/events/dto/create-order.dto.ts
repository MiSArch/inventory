import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, ValidateNested, IsArray, IsInt, Min } from 'class-validator';

/**
 * Enum representing the status of an order.
 */
export enum OrderStatus {
  PENDING = 'PENDING',
  PLACED = 'PLACED',
  REJECTED = 'REJECTED',
}

/**
 * Enum representing the possible reasons for rejecting an order.
 */
export enum RejectionReason {
  INVALID_ORDER_DATA = 'INVALID_ORDER_DATA',
  INVENTORY_RESERVATION_FAILED = 'INVENTORY_RESERVATION_FAILED',
}

/**
 * Enum representing the status of a shipment.
 */
enum ShipmentStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED',
}

/**
 * DTO representing a shipment.
 */
export class ShipmentDTO {
  @IsEnum(ShipmentStatus)
  status: ShipmentStatus;

  @IsUUID()
  shipmentMethodId: string;


}

/**
 * DTO representing an order.
 */
export class OrderDTO {
    @IsUUID()
    id: string;

    @IsUUID()
    userId: string;

    @IsDate()
    createdAt: Date;

    @IsEnum(OrderStatus)
    orderStatus: OrderStatus;

    @IsOptional()
    @IsDate()
    placedAt?: Date;

    @IsOptional()
    @IsEnum(RejectionReason)
    rejectionReason?: RejectionReason;

    @IsUUID()
    shipmentAddressId: string;

    @IsUUID()
    invoiceAddressId: string;

    @ValidateNested({ each: true })
    @Type(() => OrderItemDTO)
    @IsArray()
    orderItems: OrderItemDTO[];
}

/**
 * DTO representing an order item.
 */
export class OrderItemDTO {
    @IsUUID()
    id: string;

    @IsDate()
    createdAt: Date;

    @IsOptional()
    @IsUUID()
    productItemId?: string;

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

/**
 * DTO representing a create order event payload.
 */
export class CreateOrderDto {
    @ValidateNested()
    @Type(() => OrderDTO)
    order: OrderDTO;
}