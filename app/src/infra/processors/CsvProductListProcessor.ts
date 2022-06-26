import { ProductEntity } from "../../interfaces/entities/ProductEntity";
import { FileStorage } from "../../interfaces/infra/FileStorage";
import { ProductsRepository } from "../../interfaces/repositories/ProductsRepository";
import { WorkerProcessor } from '../../interfaces/infra/WorkerProcessor';

const PRODUCTS_CSV_FIRST_LINE = "lm;name;free_shipping;description;price;category";
const COLUMNS_COUNT = 6

export default class CsvProductListProcessor implements WorkerProcessor {
  constructor(
    private readonly fileStorage: FileStorage,
    private readonly productsRepository: ProductsRepository,
  ) {}

  async execute(filename: string): Promise<void> {
    const csv = await this.fileStorage.getFile(filename);
    const csvString = csv.toString("utf-8");
    const csvArray = csvString.split("\n");

    if (csvArray[0] !== PRODUCTS_CSV_FIRST_LINE) {
      throw new Error("Wrong csv format");
    }
    
    const products: ProductEntity[] = [];

    for (let i = 1; i < csvArray.length; i++) {
      const lineData = csvArray[i].split(";");
      if (lineData.length === COLUMNS_COUNT) {
        products.push({
          lm: +lineData[0],
          name: lineData[1],
          freeShipping: +lineData[2],
          description: lineData[3],
          price: +lineData[4],
          category: +lineData[5],
        });
      }
    }

    await this.productsRepository.addProducts(products);
    await this.fileStorage.deleteFile(filename)
  }
}
