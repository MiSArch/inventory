import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductItemBatchInput } from './dto/create-product-item-batch.input';
import { UpdateProductItemInput } from './dto/update-product-item.input';
import { InjectModel } from '@nestjs/mongoose';
import { ProductItem } from './entities/product-item.entity';
import { Model } from 'mongoose';
import { FindProductItemArgs } from './dto/find-product-item.input';
import { FindProductItemsByProductVariantArgs } from './dto/find-product-item-by-product-version-id.args';
import { ProductItemStatus } from 'src/shared/enums/inventory-status.enum';
import { ReserveProductItemsBatchInput } from './dto/reserve-product-items-batch.input';
import { ProductVariantPartialService } from 'src/product-variant-partial/product-variant-partial.service';

@Injectable()
export class InventoryService {
  constructor(
    @InjectModel(ProductItem.name) private productItemModel: Model<ProductItem>,
    // initialize logger with service context
    private readonly logger: Logger,
    // inject ProductVariantPartialService for productVariant checks
    private readonly productVariantPartialService: ProductVariantPartialService,
  ) {}

  async createProductItemBatch(
    createProductItemBatchInput: CreateProductItemBatchInput,
  ) {
    this.logger.debug(
      `{createProductItemBatch} input: ${JSON.stringify(
        createProductItemBatchInput,
      )}`,
    );

    if (
      !(await this.productVariantPartialService.findOne(
        createProductItemBatchInput.productVariantId,
      ))
    ) {
      throw new NotFoundException(
        `ProductVariant with ID "${createProductItemBatchInput.productVariantId}" not found`,
      );
    }

    const session = await this.productItemModel.startSession();
    session.startTransaction();
    try {
      const productItems = [];
      for (let i = 0; i < createProductItemBatchInput.number; i++) {
        const newProductItem = new this.productItemModel({
          ...createProductItemBatchInput,
          productVariant: createProductItemBatchInput.productVariantId,
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

    if (
      !(await this.productVariantPartialService.findOne(
        updateProductItemInput.productVariantId,
      ))
    ) {
      throw new NotFoundException(
        `ProductVariant with ID "${updateProductItemInput.productVariantId}" not found`,
      );
    }

    const existingProductItems = await this.productItemModel
      .findOneAndUpdate(
        { _id },
        {
          ...updateProductItemInput,
          productVariant: updateProductItemInput.productVariantId,
        },
      )
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

  async countByProductVariant(productVariant: string, status: ProductItemStatus): Promise<number> {
    this.logger.debug(`{countByProductVariant} query: ${productVariant}`);
    const count = await this.productItemModel.countDocuments({
      productVariant,
      inventoryStatus: status,
    });

    this.logger.debug(`{countByProductVariantId} returning ${count}`);

    return count;
  }

  async findByProductVariant(
    args: FindProductItemsByProductVariantArgs,
  ): Promise<ProductItem[]> {
    const { first, skip, orderBy, productVariantId } = args;
    this.logger.debug(
      `{findByProductVariant} query: ${JSON.stringify(args)}`,
    );

    const productItems = await this.productItemModel
      .find({
        productVariant: productVariantId,
        inventoryStatus: ProductItemStatus.IN_STORAGE,
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
  
  // function to reserve a batch of product items for an order
  async reserveProductItemBatch(reserveInput: ReserveProductItemsBatchInput): Promise<ProductItem[]> {
    // find the product items of the required product variant
    const productItems = await this.productItemModel
      .find({
        productVariant: reserveInput.productVariantId,
        inventoryStatus: ProductItemStatus.IN_STORAGE,
      })
      .limit(reserveInput.number);
    
    if (productItems.length < reserveInput.number) {
      throw new NotFoundException(
        `Not enough product items available for product variant "${reserveInput.productVariantId}"`,
      );
    }

    // set the inventory status of the selected product items to reserved
    const ids = productItems.map((productItem) => productItem._id);
    const updatedItems = await this.productItemModel.updateMany(
      { _id: { $in: ids } },
      { $set: {
        inventoryStatus: ProductItemStatus.RESERVED,
        orderId: reserveInput.orderId,
      } },
      { multi: true, upsert: true },
    );

    // return the reserved product items
    return this.productItemModel.find({ _id: { $in: ids } });
  }

  // releases product items reserved for an order due to failure
  async releaseProductItemBatch(orderId: string): Promise<ProductItem[]> {
    this.logger.log(`Releasing product items reserved for order: {${orderId}}`);
    const productItems = await this.productItemModel.find({ orderId });

    if (productItems.length === 0) {
      this.logger.log(`No product items reserved for order: {${orderId}}`);
    }

    const ids = productItems.map((productItem) => productItem._id);
    await this.productItemModel.updateMany(
      { _id: { $in: ids } },
      { $set: {
        inventoryStatus: ProductItemStatus.IN_STORAGE,
        orderId: null,
      } },
      { multi: true, upsert: true },
    );

    this.logger.log(`Released ${ids.length} product items reserved for order: {${orderId}}`);

    return this.productItemModel.find({ _id: { $in: ids } });
  }
}
