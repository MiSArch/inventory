import { Body, Controller, Get, Logger, Post } from '@nestjs/common';
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
  async subscribeToEvent(@Body() body: any): Promise<void> {
    // Handle incoming event data from Dapr
    const id = body.data.id;
    this.logger.log(`Received event for product variant with id: ${id}`);
    // Call the product variant service to create a new product variant
    this.productVariantService.create(id);
  }
}
