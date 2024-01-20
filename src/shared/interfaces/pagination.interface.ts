export interface IPaginatedType<T> {
    nodes: T[];
    totalCount: number;
    hasNextPage: boolean;
}