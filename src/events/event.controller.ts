import { Body, Controller, Get, Logger, Post, UnprocessableEntityException } from '@nestjs/common';
import { ProductVariantPartialService } from 'src/product-variant-partial/product-variant-partial.service';
import { InventoryService } from 'src/inventory/inventory.service';
import { EventPublisherService } from './event-publisher.service';
import { ReservationSucceededDTO } from './dto/inventory/reservation-succeeded.dto';
import { ReservationFailedDTO } from './dto/inventory/reservation-failed.dto';
import { OrderDTO } from './dto/order/order.dto';
import { ProductVariantCreatedDto } from './dto/catalog/product-variant-created.dto';
import { PaymentEnabledDto } from './dto/payment/payment-enabled.dto';
import { ProductItemStatus } from 'src/shared/enums/inventory-status.enum';
import { ShipmentStatus, ShipmentStatusUpdatedDto } from './dto/shipment/shiptment-status-updated.dto';
import { PaymentFailedDto } from './dto/payment/payment-failed.dto';
import { DiscountValidationFailedDTO } from './dto/discount/discount-validation-failed.dto';

/**
 * Controller for incoming Events
 */
@Controller()
export class EventController {

  constructor(
    private readonly productVariantService: ProductVariantPartialService,
    private readonly inventoryService: InventoryService,
    private readonly logger: Logger,
    private readonly eventPublisherService: EventPublisherService,
  ) {}

  /**
   * Subscribes to the product variant and order events.
   * @returns A promise that resolves to an array of objects containing the pubsubName, topic, and route.
  */
  @Get('/dapr/subscribe')
  async subscribe(): Promise<any> {
    return [
      {
        pubsubName: 'pubsub',
        topic: 'catalog/product-variant/created',
        route: 'product-variant-created',
      }, {
        pubsubName: 'pubsub',
        topic: 'order/order/created',
        route: 'order-created',
      }, {
        pubsubname: 'pubsub',
        topic: 'payment/payment/payment-enabled',
        route: 'payment-enabled'
      }, {
        pubsubname: 'pubsub',
        topic: 'payment/payment/payment-failed',
        route: 'payment-failed'
      }, {
        pubsubname: 'pubsub',
        topic: 'shipment/shipment/status-updated',
        route: 'shipment-status-updated'
      }, {
        pubsubname: 'pubsub',
        topic: 'shipment/shipment/created',
        route: 'shipment-created'
      }, {
        pubsubname: 'pubsub',
        topic: 'discount/order/validation-failed',
        route: 'discount-validation-failed'
      }
  ];
  }

  /**
   * Endpoint for product variant creation events.
   * @param body - The event data received from Dapr.
   * @returns A promise that resolves to void.
  */
  @Post('product-variant-created')
  async subscribeToProductVariantEvent(@Body('data') dto: ProductVariantCreatedDto): Promise<void> {
    // Handle incoming event data from Dapr
    const { id } = dto;
    this.logger.log(`Received create event for product variant with id: ${id}`);
    // Call the product variant service to create a new product variant
    this.productVariantService.create(id);
  }

  /**
   * Endpoint for order creation events.
   * @param orderDto - The order data received from Dapr.
   * @returns A promise that resolves to void.
  */
  @Post('order-created')
  async subscribeToOrderEvent(@Body('data') order: OrderDTO) {
    this.logger.log(`Received create event for order with id: ${order.id}`);
    try {
      const results = await this.batchPromiseOrderItems(order);
      // Filter out unsuccessful reservations and extract their productVariantIds
      const unsuccessfulProductVariantIds = results
        .filter(result => !result.success)
        .map(result => result.productVariantId);

      if (unsuccessfulProductVariantIds.length > 0) {
        this.logger.error(`Failed to reserve product items for order with id: ${order.id}`);
        this.createInventoryErrorEvent(order, unsuccessfulProductVariantIds);
        // release the reserved product items
        return this.inventoryService.releaseProductItemBatch(order.id);
      }
      this.createInventorySuccessEvent(order);
    } catch (error) {
      this.logger.error(`Error processing order event: ${error}`);
      return new UnprocessableEntityException({ message: error.message });
    }
  }

  /**
   * Endpoint for payment enabled events.
   * Updates all product items in an order to the IN_FULFILLMENT status.
   * @param paymentDto - The payment data received from Dapr.
   * @returns A promise that resolves to void.
  */
  @Post('payment-enabled')
  async subsribeToPaymentEvent(
    @Body('data') paymentDto: PaymentEnabledDto
  ): Promise<void> {
    const { order } = paymentDto;
    // Handle incoming event data from Dapr
    this.logger.log(`Received payment enabled for order with id: ${order.id}`);
    return this.inventoryService.updateOrderProductItemsStatus(
      order.id, ProductItemStatus.IN_FULFILLMENT
    );
  }

  /**
   * Endpoint for payment failed events.
   * Releases all product items in an order.
   * @param paymentDto - The payment data received from Dapr.
   * @returns A promise that resolves to void.
  */
  @Post('payment-failed')
  async subscribeToPaymentFailedEvent(
    @Body('data') paymentDto: PaymentFailedDto
  ): Promise<void> {
    const { order } = paymentDto;
    // Handle incoming event data from Dapr
    this.logger.log(`Received payment failed for order with id: ${order.id}`);
    this.inventoryService.releaseProductItemBatch(order.id);
  }

  /**
   * Endpoint for shipment created events.
   * Updates the status of the product items in an order to SHIPPED.
   * @param shipmentDto - The shipment data received from Dapr.
   * @returns A promise that resolves to void.
  */
  @Post('shipment-created')
  async subscribeToShipmentCreatedEvent(
    @Body('data') shipmentDto: ShipmentStatusUpdatedDto
  ): Promise<void> {
    const { orderId } = shipmentDto;
    // create is for return process
    if (!orderId) {
      return;
    }
    this.logger.log(`Received shipment created event for order with id: ${orderId}`);
    return this.inventoryService.updateOrderProductItemsStatus(
      orderId,
      ProductItemStatus.SHIPPED
    );
  }

  /**
   * Endpoint for shipment status updated events.
   * Updates the status of the product items in an order based on the shipment status.
   * @param shipmentDto - The shipment data received from Dapr.
   * @returns A promise that resolves to void.
  */
  @Post('shipment-status-updated')
  async subscribeToShipmentStatusUpdate(
    @Body('data') shipmentDto: ShipmentStatusUpdatedDto
  ): Promise<void> {
    const { orderId, status } = shipmentDto;
    // update is for return process
    if (!orderId) {
      return;
    }
    this.logger.log(`Received shipment status update for order with id: ${orderId} -> ${status}`);

    switch (status) {
      case ShipmentStatus.DELIVERED:
        return this.inventoryService.updateOrderProductItemsStatus(
          orderId,
          ProductItemStatus.DELIVERED
        );
      case ShipmentStatus.FAILED:
        return this.inventoryService.updateOrderProductItemsStatus(
          orderId,
          ProductItemStatus.LOST
        );
    }
  }

  /**
   * Endpoint for discount validation failed events.
   * Releases all product items in an order.
   * @param order - The order data received from Dapr.
   * @returns A promise that resolves to void.
  */
  @Post('discount-validation-failed')
  async subscribeToDiscountValidationFailedEvent(
    @Body('data') discountDto: DiscountValidationFailedDTO
  ): Promise<void> {
    const { order } = discountDto;
    this.logger.log(`Received discount validation failed for order with id: ${order.id}`);
    this.inventoryService.releaseProductItemBatch(order.id);
  }

  /**
   * Reserves product items in batch for an order.
   * @param order - The order containing the order items to be reserved.
   * @returns A promise that resolves to an array of objects containing the productVariantId and the reservation result.
   */
  private async batchPromiseOrderItems(
    order: OrderDTO
  ): Promise<{productVariantId: string, success: boolean}[]>{
    // Map each order item to a promise that resolves to an object containing the productVariantId and the result
    const reservationPromises = order.orderItems
      .map(async ({ productVariantId, count }) => {
        try {
          const result = await this.inventoryService
            .reserveProductItemBatch({
              productVariantId,
              number: count,
              orderId: order.id
            });
          return { productVariantId, success: result !== undefined };
        } catch (error) {
          this.logger.error(`Error reserving product item with productVariantId "${productVariantId}": ${error}`);
          // A failure in reservation means there were not enough product items
          return { productVariantId, success: false };
        }
      });

    // Wait for all service calls to resolve
    const results = await Promise.all(reservationPromises);
    return results;
  }

  /**
   * Creates an inventory success event.
   * This event indicates that product items have been reserved.
   * @param order - The order context.
   */
  createInventorySuccessEvent(order: OrderDTO): void {
    this.logger.log(`Successfully reserved product items for order with id: ${order.id}`);
    const eventPayload: ReservationSucceededDTO = {
        order
    };
    // send event
    this.eventPublisherService.publishEvent(
      'pubsub',
      'inventory/product-item/reservation-succeeded',
      eventPayload
    );
  }

  /**
   * Creates an inventory error event.
   * This event indicates that product items could not be reserved.
   * @param order - The order context.
   * @param productVariantIds - The IDs of the product variants for which reservation failed.
   */
  createInventoryErrorEvent(order: OrderDTO, productVariantIds: string[]): void {
    const eventPayload: ReservationFailedDTO = {
      order,
      failedProductVariantIds: productVariantIds
    };
    // send event
    this.eventPublisherService.publishEvent(
      'pubsub',
      'inventory/product-item/reservation-failed',
      eventPayload
    );
  }

}
