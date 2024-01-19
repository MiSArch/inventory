import { ObjectType } from "@nestjs/graphql";
import { Paginated } from "../../shared/utils/pagination.utils";
import { ProductItem } from "src/inventory/entities/product-item.entity";

@ObjectType()
export class PaginatedProductItem extends Paginated(ProductItem) {}