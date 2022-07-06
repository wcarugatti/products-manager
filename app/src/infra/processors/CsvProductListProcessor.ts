import { ProductEntity } from "../../interfaces/entities/ProductEntity";
import { FileStorage } from "../../interfaces/infra/FileStorage";
import { WorkerProcessor } from "../../interfaces/infra/WorkerProcessor";
import { ProductsRepository } from "./../../interfaces/repositories/ProductsRepository.d";
import readline from "readline";

const PRODUCTS_CSV_FIRST_LINE = "name;free_shipping;description;price;category";
const COLUMNS_COUNT = 5;

export default class CsvProductListProcessor implements WorkerProcessor {
  constructor(
    private readonly fileStorage: FileStorage,
    private readonly productsRepository: ProductsRepository,
  ) {}

  async execute(filename: string): Promise<void> {
    const readable = await this.fileStorage.getFileReadable(filename);
    const readlineReadable = readline.createInterface({
      input: readable,
    });

    for await (const line of readlineReadable) {
      if (line === PRODUCTS_CSV_FIRST_LINE) {
        continue;
      }
      const lineData = line.split(";");
      if (lineData.length !== COLUMNS_COUNT) {
        continue;
      }
      const [name, freeShipping, description, price, category] = lineData;
      const product: ProductEntity = {
        name,
        freeShipping: +freeShipping,
        description,
        price: parseFloat(price),
        category: +category,
      };
      await this.productsRepository.addProduct(product);
    }
    await this.fileStorage.deleteFile(filename);
  }
}
