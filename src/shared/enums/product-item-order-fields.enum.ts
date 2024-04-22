import { registerEnumType } from "@nestjs/graphql";


/**
 * Enum representing the fields by which product items can be ordered.
 */
export enum ProductItemOrderField {
    // Order Product Items by their ID
    ID = "_id"
}

// Register the ProductItemOrderField enum with GraphQL
registerEnumType(ProductItemOrderField, {
    name: 'ProductItemOrderField',
    description: 'The field to order Product Items by',
    valuesMap: {
        ID: {
          description: 'Order Product Items by their ID',
        },
      },
});