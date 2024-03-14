import { registerEnumType } from "@nestjs/graphql";

export enum OrderDirection {
    // Ascending order
    ASC = 1,
    // Descending order
    DESC = -1,
}

// Register the OrderDirection enum with GraphQL
registerEnumType(OrderDirection, {
    name: 'OrderDirection',
    description: 'The direction to order a list of items by',
    valuesMap: {
        ASC: {
          description: 'Ascending Order',
        },
        DESC: {
          description: 'Decending Order',
        },
      },
  });