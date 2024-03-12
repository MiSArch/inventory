import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductItemBatchInput } from './dto/create-product-item-batch.input';
import { UpdateProductItemInput } from './dto/update-product-item.input';
import { InjectModel } from '@nestjs/mongoose';
import { ProductItem } from './entities/product-item.entity';
import { Model } from 'mongoose';
import { FindProductItemArgs } from './dto/find-product-item.input';
import { ProductItemStatus } from 'src/shared/enums/inventory-status.enum';
import { ReserveProductItemsBatchInput } from './dto/reserve-product-items-batch.input';
import { ProductVariantPartialService } from 'src/product-variant-partial/product-variant-partial.service';
import { ProductItemConnection } from './graphql-types/product-item-connection.dto';
import { ProductItemOrderField } from 'src/shared/enums/product-item-order-fields.enum';

@Injectable()
export class InventoryService {
  constructor(
    // inject the ProductItem model
    @InjectModel(ProductItem.name) private productItemModel: Model<ProductItem>,
    // initialize logger with service context
    private readonly logger: Logger,
    // inject ProductVariantPartialService for productVariant checks
    private readonly productVariantPartialService: ProductVariantPartialService,
  ) {}

  /**
   * Creates a batch of product items based on the provided input.
   * @param createProductItemBatchInput - The input data for creating the product item batch.
   * @returns A Promise that resolves to an array of created product items.
   * @throws NotFoundException if the product variant with the specified ID is not found.
   */
  async createProductItemBatch(
    createProductItemBatchInput: CreateProductItemBatchInput,
  ): Promise<ProductItem[]> {
    this.logger.debug(
      `{createProductItemBatch} input: ${JSON.stringify(
        createProductItemBatchInput,
      )}`,
    );

    if (
      !(await this.productVariantPartialService.findById(
        createProductItemBatchInput.productVariantId,
      ))
    ) {
      throw new NotFoundException(
        `ProductVariant with ID "${createProductItemBatchInput.productVariantId}" not found`,
      );
    }

    // handle batch creation in a transaction to be able to roll back
    const session = await this.productItemModel.startSession();
    session.startTransaction();
    try {
      // store the created product items in an array
      const productItems = [];

      // create the specified number of product items
      for (let i = 0; i < createProductItemBatchInput.number; i++) {
        const newProductItem = new this.productItemModel({
          ...createProductItemBatchInput,
          productVariant: createProductItemBatchInput.productVariantId,
        });
        const savedProductItem = await newProductItem.save({ session });
        productItems.push(savedProductItem);
      }

      // commit the transaction if all product items were created successfully
      await session.commitTransaction();

      this.logger.debug(
        `{create} created ${productItems.length} product items`,
      );
      return productItems;
    } catch (error) {
      // roll back all changes if an error occurred
      await session.abortTransaction();
      this.logError('createProductItemBatch', error);
      throw error;
    } finally {
      session.endSession();
    }
  }

  /**
   * Retrieves product items based on the provided arguments.
   * @param args - The arguments for pagination and sorting.
   * @param filter - The filter to apply to the query.
   * @returns A promise that resolves to an array of product items.
   */
  async find(args: FindProductItemArgs, filter: any): Promise<ProductItem[]> {
    const { first, skip, orderBy } = args;
    this.logger.debug(
      `{find} query ${JSON.stringify(args)} with filter ${JSON.stringify(
        filter,
      )}`,
    );

    // retrieve the product items based on the provided arguments
    const productItems = await this.productItemModel
      .find(filter)
      .limit(first)
      .skip(skip)
      .sort({ [orderBy.field]: orderBy.direction });

    this.logger.debug(`{findAll} returning ${productItems.length} results`);

    return productItems;
  }

  /**
   * Finds a product item by its id.
   * @param _id - The id of the product item to find.
   * @returns The found product item.
   * @throws NotFoundException if the product item with the specified id is not found.
   */
  async findById(_id: string): Promise<ProductItem> {
    this.logger.debug(`{findById} query: ${_id}`);

    const existingProductItem = await this.productItemModel.findById(_id);

    if (!existingProductItem) {
      throw new NotFoundException(`ProductItem with ID "${_id}" not found`);
    }

    this.logger.debug(`{findById} returning ${existingProductItem._id}`);

    return existingProductItem;
  }

  /**
   * Updates a product item based on the provided input.
   * @param _id - The id of the product item to update.
   * @param updateProductItemInput - The input data for updating the product item.
   * @returns The updated product item.
   * @throws NotFoundException if the product item with the specified id is not found.
   */
  async update(
    _id: string,
    updateProductItemInput: UpdateProductItemInput,
  ): Promise<ProductItem> {
    const { productVariantId } = updateProductItemInput;
    this.logger.debug(
      `{update} for ${_id} input: ${JSON.stringify(updateProductItemInput)}`,
    );

    if (!(await this.productVariantPartialService.findById(productVariantId))) {
      throw new NotFoundException(
        `ProductVariant with ID "${productVariantId}" not found`,
      );
    }

    const existingProductItems = await this.productItemModel
      .findOneAndUpdate(
        { _id },
        {
          ...updateProductItemInput,
          productVariant: productVariantId,
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

  /**
   * Deletes a product item by its ID.
   * @param _id The ID of the product item to delete.
   * @returns A promise that resolves to the deleted product item.
   */
  async delete(_id: string) {
    this.logger.debug(`{delete} query: ${_id}`);

    const deletedProductItem =
      await this.productItemModel.findByIdAndDelete(_id);

    this.logger.debug(
      `{delete} returning ${JSON.stringify(deletedProductItem)}`,
    );
    return deletedProductItem;
  }

  /**
   * Counts the number of product items for a given product variant and status.
   * @param productVariant The product variant to count product items for.
   * @param status The status to filter the product items by.
   * @returns A promise that resolves to the count of product items.
   */
  async count(filter: any): Promise<number> {
    this.logger.debug(`{count} query: ${JSON.stringify(filter)}`);
    const count = await this.productItemModel.countDocuments(filter);

    this.logger.debug(`{count} returning ${count}`);

    return count;
  }

  async buildConnection(
    query: string[],
    args: FindProductItemArgs,
    filter?: any,
  ): Promise<ProductItemConnection> {
    const { first, skip } = args;
    let { orderBy } = args;
    let connection = new ProductItemConnection();

    if (query.includes('nodes')) {
      // default order is ascending by id
      if (!orderBy) {
        orderBy = {
          field: ProductItemOrderField.ID,
          direction: 1,
        };
      }

      // get nodes according to args
      connection.nodes = await this.find(args, filter);
    }

    if (query.includes('totalCount') || query.includes('hasNextPage')) {
      connection.totalCount = await this.count(filter);
      connection.hasNextPage = skip + first < connection.totalCount;
    }
    return connection;
  }

  /**
   * Retrieves the count of product items in the collection.
   * @returns A promise that resolves to the count of product items.
   */
  async getCount(): Promise<number> {
    this.logger.debug('{getCount} retrieving collection count');
    const count = await this.productItemModel.countDocuments();
    return count;
  }

  /**
   * Logs an error message along with the function name, error message, and stack trace.
   *
   * @param functionName - The name of the function where the error occurred.
   * @param error - The error object containing the error message and stack trace.
   */
  logError(functionName: string, error: Error) {
    this.logger.error(`{${functionName}} ${error.message} ${error.stack}`);
  }

  /**
   * Reserves a batch of product items.
   *
   * @param reserveInput - The input data for reserving product items.
   * @returns A promise that resolves to an array of reserved product items.
   * @throws NotFoundException if there are not enough product items available for the specified product variant.
   */
  async reserveProductItemBatch(
    reserveInput: ReserveProductItemsBatchInput,
  ): Promise<ProductItem[]> {
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
      {
        $set: {
          inventoryStatus: ProductItemStatus.RESERVED,
          orderId: reserveInput.orderId,
        },
      },
      { multi: true, upsert: true },
    );

    // return the reserved product items
    return this.productItemModel.find({ _id: { $in: ids } });
  }

  /**
   * Releases a batch of product items reserved for an order.
   *
   * @param orderId - The id of the order for which to release the product items.
   * @returns A promise that resolves to an array of released product items.
   */
  async releaseProductItemBatch(orderId: string): Promise<ProductItem[]> {
    this.logger.log(`Releasing product items reserved for order: {${orderId}}`);
    const productItems = await this.productItemModel.find({ orderId });

    if (productItems.length === 0) {
      this.logger.log(`No product items reserved for order: {${orderId}}`);
    }

    const ids = productItems.map((productItem) => productItem._id);
    await this.productItemModel.updateMany(
      { _id: { $in: ids } },
      {
        $set: {
          inventoryStatus: ProductItemStatus.IN_STORAGE,
          orderId: null,
        },
      },
      { multi: true, upsert: true },
    );

    this.logger.log(
      `Released ${ids.length} product items reserved for order: {${orderId}}`,
    );

    return this.productItemModel.find({ _id: { $in: ids } });
  }
}
