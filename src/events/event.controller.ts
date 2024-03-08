import { Body, Controller, Get, Logger, Post } from '@nestjs/common';
import { ProductVariantPartialService } from 'src/product-variant-partial/product-variant-partial.service';
import { CreateOrderDto, OrderDTO } from './dto/create-order.dto';
import { InventoryService } from 'src/inventory/inventory.service';
import { EventPublisherService } from './event-publisher.service';


@Controller()
export class EventController {

  constructor(
    private readonly productVariantService: ProductVariantPartialService,
    private readonly inventoryService: InventoryService,
    private readonly logger: Logger,
    private readonly eventPublisherService: EventPublisherService,
  ) {}

  @Get('/dapr/subscribe')
  /**
   * Subscribes to the product variant and order events.
   * 
   * @returns A promise that resolves to an array of objects containing the pubsubName, topic, and route.
   */
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
      }
  ];
  }

  @Post('product-variant-created')
  /**
   * Endpoint for product variant creation events.
   * 
   * @param body - The event data received from Dapr.
   * @returns A promise that resolves to void.
   */
  async subscribeToProductVariantEvent(@Body() body: any): Promise<void> {
    // Handle incoming event data from Dapr
    const id = body.data.id;
    this.logger.log(`Received event for product variant with id: ${id}`);
    // Call the product variant service to create a new product variant
    this.productVariantService.create(id);
  }


  @Post('order-created')
  /**
   * Endpoint for order creation events.
   * 
   * @param orderDto - The order data received from Dapr.
   * @returns A promise that resolves to void.
   */
  async subscribeToOrderEvent(@Body('data') orderDto: CreateOrderDto): Promise<void> {
    // Handle incoming event data from Dapr
    const { order } = orderDto
    this.logger.log(`Received event for order with id: ${order.id} with orderItems ${order.orderItems}`);
    
    try {
      // Attempt to reserve all product items for the order
      const results = await this.batchPromiseOrderItems(order);

      // Filter out unsuccessful reservations and extract their productVariantIds
      const unsuccessfulProductVariantIds = results
        .filter(result => !result.success)
        .map(result => result.productVariantId);

      // Check total order reservation status
      if (unsuccessfulProductVariantIds.length > 0) {
        // Not all were successful
        this.createInventoryErrorEvent(order, unsuccessfulProductVariantIds);
        // release the reserved product items
        this.inventoryService.releaseProductItemBatch(order.id);
      } else {
        // All were successful
        this.createInventorySuccessEvent(order);
      }
    } catch (error) {
      this.logger.error(`Error processing order event: ${error}`);
    }
  }

  
  /**
   * Reserves product items in batch for an order.
   * @param order - The order containing the order items to be reserved.
   * @returns A promise that resolves to an array of objects containing the productVariantId and the reservation result.
   */
  private async batchPromiseOrderItems(order: OrderDTO) {
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
    const eventPayload = {
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
    const eventPayload = {
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
