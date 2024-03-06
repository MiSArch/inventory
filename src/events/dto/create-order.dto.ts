import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, ValidateNested, IsArray, IsInt, Min } from 'class-validator';

export enum OrderStatus {
  PENDING = 'PENDING',
  PLACED = 'PLACED',
  REJECTED = 'REJECTED',
}

export enum RejectionReason {
  INVALID_ORDER_DATA = 'INVALID_ORDER_DATA',
  INVENTORY_RESERVATION_FAILED = 'INVENTORY_RESERVATION_FAILED',
}

enum ShipmentStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED',
}

export class ShipmentDTO {
  @IsEnum(ShipmentStatus)
  status: ShipmentStatus;

  @IsUUID()
  shipmentMethodId: string;
}

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

    @ValidateNested({ each: true })
    @Type(() => OrderItemDTO)
    @IsArray()
    orderItems: OrderItemDTO[];
}

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

export class CreateOrderDto {
    @ValidateNested()
    @Type(() => OrderDTO)
    order: OrderDTO;
}