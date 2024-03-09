/**
 * Enum representing the status of an order.
 */
export enum OrderStatus {
  // The order is pending and has not been placed yet.
  PENDING = 'PENDING',
  // The order has been placed.
  PLACED = 'PLACED',
  // The order has been rejected.
  REJECTED = 'REJECTED',
}