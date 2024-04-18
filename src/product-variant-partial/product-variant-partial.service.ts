import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ProductVariantPartial } from './entities/product-variant-partial.entity';
import { Model } from 'mongoose';

/**
 * Service for handling product variant partials.
 */
@Injectable()
export class ProductVariantPartialService {
  constructor(
    // inject the ProductVariantPartial model
    @InjectModel(ProductVariantPartial.name)
    private productVariantPartialModel: Model<ProductVariantPartial>,
    // initialize logger with service context
    private readonly logger: Logger,
  ) {}

  /**
   * Creates a new product variant partial.
   * @param productVariantId - The id of the product variant.
   * @returns A promise that resolves to the created product variant partial.
   */
  async create(productVariantId: string): Promise<ProductVariantPartial> {
    this.logger.log(`{create} input: ${productVariantId}`);
    return this.productVariantPartialModel.create({ _id: productVariantId });
  }

  /**
   * Finds a product variant partial by id.
   * @param id - The id of the product variant partial.
   * @returns A promise that resolves to the found product variant partial.
   */
  async findById(id: string): Promise<ProductVariantPartial> {
    this.logger.log(`{findById} input: ${id}`);
    return this.productVariantPartialModel.findById(id);
  }
}
