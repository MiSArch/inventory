import { registerEnumType } from "@nestjs/graphql";

// Enum for the status of an individual product item in the inventory
export enum ProductItemStatus {
    // The item is in storage, not yet sold or reserved
    IN_STORAGE = 'IN_STORAGE',
    // The item has been reserved for a customer but not yet sold
    RESERVED = 'RESERVED',
    // The item is in the process of being fulfilled (packed, shipped)
    IN_FULFILLMENT = 'IN_FULFILLMENT',
    // The item has been shipped to the customer
    SHIPPED = 'SHIPPED',
    // The item has been delivered to the customer
    DELIVERED = 'DELIVERED',
    // The item has been returned by the customer
    RETURNED = 'RETURNED',
    // The item has been lost (e.g., during shipping or in the warehouse)
    LOST = 'LOST',
}

// Register the enum with GraphQL
registerEnumType(ProductItemStatus, {
    name: 'ProductItemStatus',
    description: 'The status of an individual product item in the inventory',
    valuesMap: {
        IN_STORAGE: {
            description: 'The item is in storage, not yet sold or reserved',
        },
        RESERVED: {
            description: 'The item has been reserved for a customer but not yet sold',
        },
        IN_FULFILLMENT: {
            description: 'The item is in the process of being fulfilled (packed, shipped)',
        },
        SHIPPED: {
            description: 'The item has been shipped to the customer',
        },
        DELIVERED: {
            description: 'The item has been delivered to the customer',
        },
        RETURNED: {
            description: 'The item has been returned by the customer',
        },
        LOST: {
            description: 'The item has been lost (e.g., during shipping or in the warehouse)',
        },
    },
});