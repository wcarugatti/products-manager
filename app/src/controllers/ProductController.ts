import { Request, Response } from "express";
import { extractAllowedFields } from "../utils/utils";
import ProductsRepositoryPostgres from "./../infra/postgres/repositories/ProductsRepositoryPostgres";

export default class ProductController {
  static async getProducts(_: Request, res: Response) {
    const repository = new ProductsRepositoryPostgres();
    const products = await repository.getProducts();
    return res.send(products);
  }

  static async removeProduct(req: Request, res: Response) {
    const { id } = req.params;
    const repository = new ProductsRepositoryPostgres();
    try {
      await repository.removeProduct(id);
      return res.send();
    } catch (error) {
      return res.status(404).send("Product not found");
    }
  }

  static async getProduct(req: Request, res: Response) {
    const { id } = req.params;
    const repository = new ProductsRepositoryPostgres();
    try {
      const product = await repository.getProduct(id);
      if (product) {
        return res.send(product);
      }
      return res.status(404).send("Product not found");
    } catch (error) {
      return res.status(400).send();
    }
  }

  static async updateProduct(req: Request, res: Response) {
    const { id } = req.params;
    const updateFields = extractAllowedFields(
      ["lm", "name", "freeShipping", "description", "price", "category"],
      req.body,
    );
    const repository = new ProductsRepositoryPostgres();
    try {
      await repository.updateProduct(id, updateFields);
      return res.send();
    } catch (error) {
      return res.status(404).send("Product not found");
    }
  }
}
