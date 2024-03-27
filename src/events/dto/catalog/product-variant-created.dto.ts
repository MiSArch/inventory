/**
 * DTO for a creation of a new product variant.
 * @property id The id of the new product variant.
 * @property productId The relagted product id of the new product variant.
 * @property currentVersionId The current product variant version id.
 * @property isPubliclyVisible indicates, if buyers can see the product variant
 */
export class ProductVariantCreatedDto {
    id: string;
    productId: string;
    currentVersionId: string;
    isPubliclyVisible: boolean;
}