export interface IPaginatedType<T> {
    items: T[];
    totalCount: number;
    hasNextPage: boolean;
}