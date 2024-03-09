import { OrderDTO } from "../order/order.dto";

/**
 * DTO for a successful reservation of all products in the order.
 * @property order - The order for which all items were successfully reserved.
 */
export class ReservationSucceededDTO {
  order: OrderDTO;
}