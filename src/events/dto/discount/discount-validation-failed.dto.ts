import { OrderDTO } from "../order/order.dto";

/**
 * DTO for a failed validation of an order's discounts.
 * @property order - The order for which the validation failed.
 * @property failingDiscountIds - The IDs of the discounts for which the validation failed.
 */
export class DiscountValidationFailedDTO {
  order: OrderDTO;
  failingDiscountIds: string[];
}