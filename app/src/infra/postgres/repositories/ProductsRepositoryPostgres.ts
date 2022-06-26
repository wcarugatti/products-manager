import { DeepPartial } from "typeorm";
import { ProductEntity } from "../../../interfaces/entities/ProductEntity";
import { ProductsRepository } from "./../../../interfaces/repositories/ProductsRepository.d";
import { ProductModel } from "./../models/ProductModel";

export default class ProductsRepositoryPostgres implements ProductsRepository {
  async addProducts(productsList: DeepPartial<ProductModel[]>): Promise<void> {
    const products = ProductModel.create(productsList);
    await ProductModel.insert(products);
  }

  async removeProduct(productId: string): Promise<void> {
    await ProductModel.delete(productId);
  }

  async getProducts(): Promise<ProductModel[]> {
    return await ProductModel.find();
  }

  async getProduct(productId: string): Promise<ProductModel> {
    return await ProductModel.findOneBy({ id: productId });
  }

  async updateProduct(
    productId: string,
    newProduct: Partial<ProductEntity>,
  ): Promise<void> {
    await ProductModel.update({ id: productId }, newProduct);
  }
}
