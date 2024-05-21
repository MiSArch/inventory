import { IsObject } from 'class-validator';
import { OrderDTO } from '../order/order.dto';

/**
 * DTO that means that all required steps to enable the payment later were successfully finished.
 * It is usually send after the payment was created except for prepaid payments
 * @property order - The order for the payment was processed.
 */
export class PaymentEnabledDto {
  @IsObject()
  order: OrderDTO;
}
