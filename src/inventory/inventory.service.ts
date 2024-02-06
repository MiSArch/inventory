import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductItemBatchInput } from './dto/create-product-item-batch.input';
import { UpdateProductItemInput } from './dto/update-product-item.input';
import { InjectModel } from '@nestjs/mongoose';
import { ProductItem } from './entities/product-item.entity';
import { Model } from 'mongoose';
import { FindProductItemArgs } from './dto/find-product-item.input';
import { FindProductItemsByProductVariantArgs } from './dto/find-product-item-by-product-version-id.args';

@Injectable()
export class InventoryService {
  constructor(
    @InjectModel(ProductItem.name) private productItemModel: Model<ProductItem>,
    // initialize logger with service context
    private readonly logger: Logger,
  ) {}

  async createProductItemBatch(
    createProductItemBatchInput: CreateProductItemBatchInput,
  ) {
    this.logger.debug(
      `{createProductItemBatch} input: ${JSON.stringify(
        createProductItemBatchInput,
      )}`,
    );

    const session = await this.productItemModel.startSession();
    session.startTransaction();
    try {
      const productItems = [];
      for (let i = 0; i < createProductItemBatchInput.number; i++) {
        const newProductItem = new this.productItemModel({
          ...createProductItemBatchInput,
        });
        const savedProductItem = await newProductItem.save({ session });
        productItems.push(savedProductItem);
      }
      await session.commitTransaction();

      this.logger.debug(
        `{create} created ${productItems.length} product items`,
      );
      return productItems;
    } catch (error) {
      await session.abortTransaction();
      this.logError('createProductItemBatch', error);
      throw error;
    } finally {
      session.endSession();
    }
  }

  async findAll(args: FindProductItemArgs): Promise<ProductItem[]> {
    const { first, skip, orderBy } = args;
    this.logger.debug(`{findAll} query ${JSON.stringify(args)}`);

    const productItems = await this.productItemModel
      .find({})
      .limit(first)
      .skip(skip)
      .sort({ [orderBy.field]: orderBy.direction });

    this.logger.debug(`{findAll} returning ${productItems.length} results`);

    return productItems;
  }

  async findOne(_id: string) {
    this.logger.debug(`{findOne} query: ${_id}`);

    const existingProductItem = await this.productItemModel.findOne({ _id });

    if (!existingProductItem) {
      throw new NotFoundException(`ProductItem with ID "${_id}" not found`);
    }

    this.logger.debug(`{findOne} returning ${existingProductItem._id}`);

    return existingProductItem;
  }

  async update(_id: string, updateProductItemInput: UpdateProductItemInput) {
    this.logger.debug(
      `{update} for ${_id} input: ${JSON.stringify(updateProductItemInput)}`,
    );

    const existingProductItems = await this.productItemModel
      .findOneAndUpdate({ _id }, updateProductItemInput)
      .setOptions({ overwrite: true, new: true });

    if (!existingProductItems) {
      throw new NotFoundException(`ProductItem with ID "${_id}" not found`);
    }

    this.logger.debug(
      `{update} returning ${JSON.stringify(existingProductItems)}`,
    );

    return existingProductItems;
  }

  async delete(_id: string) {
    this.logger.debug(`{delete} query: ${_id}`);

    const deletedProductItem =
      await this.productItemModel.findByIdAndDelete(_id);

    this.logger.debug(
      `{delete} returning ${JSON.stringify(deletedProductItem)}`,
    );
    return deletedProductItem;
  }

  async countByProductVariant(productVariant: string): Promise<number> {
    this.logger.debug(`{countByProductVariant} query: ${productVariant}`);
    const count = await this.productItemModel.countDocuments({
      productVariant,
      isInInventory: true,
    });

    this.logger.debug(`{countByProductVariantId} returning ${count}`);

    return count;
  }

  async findByProductVariant(
    args: FindProductItemsByProductVariantArgs,
  ): Promise<ProductItem[]> {
    const { first, skip, orderBy, productVariant } = args;
    this.logger.debug(
      `{findByProductVariant} query: ${JSON.stringify(args)}`,
    );

    const productItems = await this.productItemModel
      .find({
        productVariant,
        isInInventory: true,
      })
      .limit(first)
      .skip(skip)
      .sort({ [orderBy.field]: orderBy.direction });

    this.logger.debug(
      `{findByProductVariantId} returning ${productItems.length} results`,
    );

    return productItems;
  }

  async getCount(): Promise<number> {
    this.logger.debug('{getCount} retrieving collection count');
    const count = await this.productItemModel.countDocuments();
    return count;
  }

  logError(functionName: string, error: Error) {
    this.logger.error(`{${functionName}} ${error.message} ${error.stack}`);
  }
}
