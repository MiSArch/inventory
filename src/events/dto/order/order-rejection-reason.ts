/**
 * Enum representing the possible reasons for rejecting an order.
 */
export enum RejectionReason {
  // The order was rejected since data was invalid.
  INVALID_ORDER_DATA = 'INVALID_ORDER_DATA',
  // The order was rejected since the product item reservation failed.
  INVENTORY_RESERVATION_FAILED = 'INVENTORY_RESERVATION_FAILED',
}