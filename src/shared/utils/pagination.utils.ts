import { Field, ObjectType, Int } from '@nestjs/graphql';
import { Type } from '@nestjs/common';
import { IPaginatedType } from '../interfaces/pagination.interface';

/**
 * Creates a paginated type for a given class reference.
 * @param classRef - The class reference for the items in the pagination.
 * @returns The paginated type.
 */
export function Paginated<T>(classRef: Type<T>): Type<IPaginatedType<T>> {
  @ObjectType({ isAbstract: true })
  abstract class PaginatedType implements IPaginatedType<T> {
    @Field(() => [classRef], {
      nullable: true,
      description: 'The resulting items',
    })
    nodes: T[];

    @Field(() => Int, {
      description: 'The total amount of items in this connection',
    })
    totalCount: number;

    @Field(() => Boolean, {
      description: 'Whether this connection has a next page',
    })
    hasNextPage: boolean;
  }
  return PaginatedType as Type<IPaginatedType<T>>;
}
