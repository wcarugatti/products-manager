import { ProductEntity } from "../entities/ProductEntity";

export interface ProductsRepository {
  addProducts(productsList: ProductEntity[]): Promise<void>;
}
