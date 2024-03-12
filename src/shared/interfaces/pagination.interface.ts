/**
 * Represents a paginated type.
 * @template T - The type of the elements in the pagination.
 */
export interface IPaginatedType<T> {
    nodes: T[];
    totalCount: number;
    hasNextPage: boolean;
}