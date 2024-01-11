import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateInventoryInput } from './dto/create-inventory.input';
import { UpdateInventoryInput } from './dto/update-inventory.input';
import { InjectModel } from '@nestjs/mongoose';
import { Inventory } from './entities/inventory.entity';
import { Model } from 'mongoose';

@Injectable()
export class InventoryService {
  constructor(
    @InjectModel(Inventory.name) private inventoryModel: Model<Inventory>,
  ) {}
  async createInventoryBatch(createInventoryInput: CreateInventoryInput) {
    const session = await this.inventoryModel.startSession();
    session.startTransaction();
    try {
      const inventoryIds = [];
      for (let i = 0; i < createInventoryInput.number; i++) {
        const newInventory = new this.inventoryModel({
          ...createInventoryInput,
        });
        const savedInventory = await newInventory.save({ session });
        inventoryIds.push(savedInventory._id.toString());
      }
      await session.commitTransaction();
      return inventoryIds;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async findAll() {
    return this.inventoryModel.find({});
  }

  async findOne(_id: string) {
    const existingInventory = await this.inventoryModel.findOne({ _id });

    if (!existingInventory) {
      throw new NotFoundException(`Inventory with ID "${_id}" not found`);
    }

    return existingInventory;
  }

  async update(_id: string, updateInventoryInput: UpdateInventoryInput) {
    const existingInventory = await this.inventoryModel
      .findOneAndUpdate({ _id }, updateInventoryInput)
      .setOptions({ overwrite: true, new: true });

    if (!existingInventory) {
      throw new NotFoundException(`Inventory with ID "${_id}" not found`);
    }

    return existingInventory;
  }

  async remove(_id: string) {
    const deletedInventory = await this.inventoryModel.findByIdAndDelete(_id);
    return deletedInventory;
  }

  async countByProductVariantId(productVariantId: string): Promise<number> {
    return this.inventoryModel.countDocuments({
      productVariantId,
      isInInventory: true,
    });
  }
}
