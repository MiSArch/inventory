import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ProductVariantPartial } from './entities/product-variant-partial.entity';
import { Model } from 'mongoose';

@Injectable()
export class ProductVariantPartialService {
  constructor(
    @InjectModel(ProductVariantPartial.name)
    private productVariantPartialModel: Model<ProductVariantPartial>,
    // initialize logger with service context
    private readonly logger: Logger,
  ) {}
  async create(productVariantId: string): Promise<ProductVariantPartial> {
    this.logger.log(`{create} input: ${productVariantId}`);
    return this.productVariantPartialModel.create({ _id: productVariantId });
  }

  async findOne(id: string): Promise<ProductVariantPartial> {
    this.logger.log(`{findOne} input: ${id}`);
    return this.productVariantPartialModel.findById(id);
  }
}
