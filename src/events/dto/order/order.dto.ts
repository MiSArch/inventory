import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsOptional,
  IsUUID,
  ValidateNested,
  IsArray,
  IsInt,
} from 'class-validator';
import { OrderStatus } from './order-status';
import { RejectionReason } from './order-rejection-reason';
import { OrderItemDTO } from './order-item.dto';

/**
 * DTO of an order of a user.
 *
 * @property id Order UUID.
 * @property userId UUID of user connected with Order.
 * @property createdAt Timestamp when Order was created.
 * @property orderStatus The status of the Order.
 * @property compensatableOrderAmount Total cost of all order items after shipping and discounts.
 * @property placedAt Timestamp of Order placement. Not present until Order is placed.
 * @property rejectionReason The rejection reason if status of the Order is REJECTED.
 * @property orderItems List of OrderItems associated with the Order.
 * @property shipmentAddressId UUID of shipment address associated with the Order.
 * @property invoiceAddressId UUID of invoice address associated with the Order.
 * @property paymentInformationId UUID of payment information associated with the Order.
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
  @IsInt()
  compensatableOrderAmount: number;
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
  @IsUUID()
  shipmentAddressId: string;
  @IsUUID()
  invoiceAddressId: string;
  @IsUUID()
  paymentInformationId: string;
}
