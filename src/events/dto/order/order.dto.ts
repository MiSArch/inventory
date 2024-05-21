import { Type } from 'class-transformer';
import {
  IsEnum,
  IsOptional,
  IsUUID,
  ValidateNested,
  IsArray,
  IsInt,
  IsDateString,
  IsNumber,
} from 'class-validator';
import { OrderStatus } from './order-status';
import { RejectionReason } from './order-rejection-reason';
import { OrderItemDTO } from './order-item.dto';

class PaymentAuthorization {
  @IsNumber()
  CVC: number;
}

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
 * @property payment_authorization Optional payment authorization information.
 * @property vat_number VAT number.
 */
export class OrderDTO {
  @IsUUID()
  id: string;
  @IsUUID()
  userId: string;
  @IsDateString()
  createdAt: Date;
  @IsEnum(OrderStatus)
  orderStatus: OrderStatus;
  @IsInt()
  compensatableOrderAmount: number;
  @IsOptional()
  @IsDateString()
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
  @ValidateNested()
  @Type(() => PaymentAuthorization)
  payment_authorization?: PaymentAuthorization;
  vat_number: string;
}
