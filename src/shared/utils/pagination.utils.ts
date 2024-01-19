import { Field, ObjectType, Int } from '@nestjs/graphql';
import { Type } from '@nestjs/common';
import { IPaginatedType } from '../interfaces/pagination.interface';
import { ProductItem } from 'src/inventory/entities/product-item.entity';

export function Paginated<T>(classRef: Type<T>): Type<IPaginatedType<T>> {
    @ObjectType({ isAbstract: true })
    abstract class PaginatedType implements IPaginatedType<T> {
      @Field((type) => [classRef], { nullable: true })
      items: T[];
  
      @Field((type) => Int)
      totalCount: number;
  
      @Field()
      hasNextPage: boolean;
    }
    return PaginatedType as Type<IPaginatedType<T>>;
}