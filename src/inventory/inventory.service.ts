import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductItemBatchInput } from './dto/create-product-item-batch.input';
import { UpdateProductItemInput } from './dto/update-product-item.input';
import { InjectModel } from '@nestjs/mongoose';
import { ProductItem } from './entities/product-item.entity';
import { Model } from 'mongoose';
import { FindProductItemArgs } from './dto/find-product-item.input';

@Injectable()
export class InventoryService {
  constructor(
    @InjectModel(ProductItem.name) private productItemModel: Model<ProductItem>,
  ) {}
  async createProductItemBatch(
    createProductItemBatchInput: CreateProductItemBatchInput,
  ) {
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
      return productItems;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async findAll(args: FindProductItemArgs): Promise<ProductItem[]> {
    const { first, skip, orderBy } = args;
    console.log('args', args)
    const nodes: ProductItem[] = await this.productItemModel
      .find({})
      .limit(first)
      .skip(skip)
      .sort({ [orderBy.field]: orderBy.direction });

    return nodes;
  }

  async findOne(_id: string) {
    const existingProductItems = await this.productItemModel.findOne({ _id });

    if (!existingProductItems) {
      throw new NotFoundException(`ProductItem with ID "${_id}" not found`);
    }

    return existingProductItems;
  }

  async update(_id: string, updateProductItemInput: UpdateProductItemInput) {
    const existingProductItems = await this.productItemModel
      .findOneAndUpdate({ _id }, updateProductItemInput)
      .setOptions({ overwrite: true, new: true });

    if (!existingProductItems) {
      throw new NotFoundException(`ProductItem with ID "${_id}" not found`);
    }

    return existingProductItems;
  }

  async delete(_id: string) {
    const deletedProductItem =
      await this.productItemModel.findByIdAndDelete(_id);
    return deletedProductItem;
  }

  async countByProductVariantId(productVariantId: string): Promise<number> {
    return this.productItemModel.countDocuments({
      productVariantId,
      isInInventory: true,
    });
  }

  async getCount(): Promise<number> {
    const count = await this.productItemModel.countDocuments()
    return count
  }
}
