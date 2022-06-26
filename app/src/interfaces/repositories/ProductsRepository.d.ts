import { ProductEntity } from "../entities/ProductEntity";

export interface ProductsRepository {
  addProducts(productsList: ProductEntity[]): Promise<void>;
  removeProduct(productId: string): Promise<void>;
  getProducts(): Promise<ProductModel[]>;
  getProduct(productId: string): Promise<ProductModel>;
  updateProduct(
    productId: string,
    newProduct: Partial<ProductEntity>,
  ): Promise<void>;
}
