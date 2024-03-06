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
  async subscribeToProductVariantEvent(@Body() body: any): Promise<void> {
    // Handle incoming event data from Dapr
    const id = body.data.id;
    this.logger.log(`Received event for product variant with id: ${id}`);
    // Call the product variant service to create a new product variant
    this.productVariantService.create(id);
  }

  @Post('order-created')
  async subscribeToOrderEvent(@Body('data') orderDto: CreateOrderDto): Promise<void> {
    // Handle incoming event data from Dapr
    const { order } = orderDto
    this.logger.log(`Received event for order with id: ${order.id} with orderItems ${order.orderItems}`);
    
    try {
      // Map each order item to a promise that resolves to an object containing the productVariantId and the result
      const reservationPromises = order.orderItems
        .map(async ({ productVariantId, count }) => {
          try {
            const result = await this.inventoryService
              .reserveProductItemBatch({ productVariantId, number: count });
            return { productVariantId, success: result !== undefined};
          } catch (error) {
            // A failure in reservation means there were not enough product items
            return { productVariantId, success: false };
          }
        });

      // Wait for all service calls to resolve
      const results = await Promise.all(reservationPromises);

      // Filter out unsuccessful reservations and extract their productVariantIds
      const unsuccessfulProductVariantIds = results
        .filter(result => !result.success)
        .map(result => result.productVariantId);

      // Check total order reservation status
      if (unsuccessfulProductVariantIds.length > 0) {
        // Not all were successful
        this.createInventoryErrorEvent(order, unsuccessfulProductVariantIds);
      } else {
        // All were successful
        this.createInventorySuccessEvent(order);
      }
    } catch (error) {
      this.logger.error(`Error processing order event: ${error}`);
    }
  }

  createInventorySuccessEvent(orderId: OrderDTO): void {
    // Create an event to indicate that product items have been reserved
    const eventPayload = {
      order: {
        id: orderId
      }
    };
    // send event
    this.eventPublisherService.publishEvent(
      'pubsub',
      'inventory/product-item/reservation-succeeded',
      eventPayload
    );
  }

  createInventoryErrorEvent(order: any, productVariantIds: string[]): void {
    // Create an event to indicate that product items could not be reserved
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
