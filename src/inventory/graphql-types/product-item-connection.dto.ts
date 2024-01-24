import { ObjectType } from "@nestjs/graphql";
import { Paginated } from "../../shared/utils/pagination.utils";
import { ProductItem } from "src/inventory/entities/product-item.entity";

@ObjectType({ description: "A connection of product items" })
export class ProductItemConnection extends Paginated(ProductItem) {}