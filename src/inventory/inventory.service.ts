import { Injectable } from '@nestjs/common';
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
  create(createInventoryInput: CreateInventoryInput) {
    console.log(createInventoryInput);
    return 'This action adds a new inventory';
  }

  findAll() {
    return `This action returns all inventory`;
  }

  findOne(id: string) {
    return `This action returns a #${id} inventory`;
  }

  update(id: string, updateInventoryInput: UpdateInventoryInput) {
    console.log(updateInventoryInput);
    return `This action updates a #${id} inventory`;
  }

  remove(id: string) {
    return `This action removes a #${id} inventory`;
  }
}
