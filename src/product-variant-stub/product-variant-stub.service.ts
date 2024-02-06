import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ProductVariantStub } from './entities/product-variant-stub.entity';
import { Model } from 'mongoose';

@Injectable()
export class ProductVariantStubService {
  constructor(
    @InjectModel(ProductVariantStub.name)
    private productVariantStubModel: Model<ProductVariantStub>,
    // initialize logger with service context
    private readonly logger: Logger,
  ) {}
  async create(productVariantId: string): Promise<ProductVariantStub> {
    this.logger.log(`{create} input: ${productVariantId}`);
    return this.productVariantStubModel.create({ _id: productVariantId });
  }

  async findOne(id: string): Promise<ProductVariantStub> {
    this.logger.log(`{findOne} input: ${id}`);
    return this.productVariantStubModel.findById(id);
  }

  async remove(id: string) {
    this.logger.log(`{remove} input: ${id}`);
    return this.productVariantStubModel.findByIdAndDelete(id)
  }
}
