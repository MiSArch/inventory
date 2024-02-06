import { Body, Controller, Get, HttpCode, Logger, Post } from '@nestjs/common';
import { ProductVariantStubService } from 'src/product-variant-stub/product-variant-stub.service';

@Controller()
export class EventController {

  constructor(
    private readonly productVariantService: ProductVariantStubService,
    private readonly logger: Logger  
  ) {}

  @Get('/dapr/subscribe')
  async subscribe(): Promise<any> {
    return [{
      pubsubName: 'pubsub',
      topic: 'catalog/product-variant/created',
      route: 'product-variant-created',
    }];
  }

  @Post('product-variant-created')
  @HttpCode(202) // Set a custom HTTP status code for successful event subscription
  async subscribeToEvent(@Body() eventData: any): Promise<void> {
    // Handle incoming event data from Dapr
    this.logger.log('Received {product-variant-created} event:', eventData);
    const { id } = eventData;

    // Call the product variant service to create a new product variant
    this.productVariantService.create(id);
  }
}
