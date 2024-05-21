import { IsObject } from 'class-validator';
import { OrderDTO } from '../order/order.dto';

/**
 * DTO that means that the payment failed finally.
 * It is send after an prepaid payment was not received in time.
 * @property order - The order for the payment was processed.
 */
export class PaymentFailedDto {
  @IsObject()
  order: OrderDTO;
}
