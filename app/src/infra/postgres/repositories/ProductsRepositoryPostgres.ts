import { DeepPartial } from "typeorm";
import { ProductEntity } from "../../../interfaces/entities/ProductEntity";
import { ProductsRepository } from "./../../../interfaces/repositories/ProductsRepository.d";
import { ProductModel } from "./../models/ProductModel";

export default class ProductsRepositoryPostgres implements ProductsRepository {
  async addProduct(product: DeepPartial<ProductModel>): Promise<void> {
    const newProduct = ProductModel.create(product);
    await ProductModel.insert(newProduct);
  }

  async removeProduct(productId: string): Promise<void> {
    const deleteResult = await ProductModel.delete(productId);
    if (!deleteResult.affected) {
      throw new Error("Product not found");
    }
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
    const updatedResult = await ProductModel.update(
      { id: productId },
      newProduct,
    );
    if (!updatedResult.affected) {
      throw new Error("Product not found");
    }
  }
}
