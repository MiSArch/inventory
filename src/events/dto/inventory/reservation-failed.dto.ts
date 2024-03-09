import { OrderDTO } from "../order/order.dto";

/**
 * DTO for a failed reservation of all products in the order.
 * @property order - The order for the reservation failed.
 * @property failedProductVariantIds - The IDs of the product variants for which the reservation failed.
 */
export class ReservationFailedDTO {
  order: OrderDTO;
  failedProductVariantIds: string[];
}