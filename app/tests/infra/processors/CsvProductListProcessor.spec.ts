import { FileStorage } from "../../../src/interfaces/infra/FileStorage";
import { ProductsRepository } from "../../../src/interfaces/repositories/ProductsRepository";
import CsvProductListProcessor from "../../../src/infra/processors/CsvProductListProcessor";
import fs from "fs";
import path from "path";
import mockProductList from "../../mocks/mockProductList";
import { Readable } from "typeorm/platform/PlatformTools";

describe("ProcessCsvProducts", () => {
  const mockRepository: ProductsRepository = {
    addProduct: jest.fn(),
    removeProduct: jest.fn(),
    getProducts: jest.fn(),
    getProduct: jest.fn(),
    updateProduct: jest.fn(),
  };

  const mockFile = fs.readFileSync(
    path.resolve(__dirname, "..", "..", "./mocks/products.csv"),
  );
  const mockFileReadable = Readable.from(mockFile.toString());
  const mockFileStorage: FileStorage = {
    upload: jest.fn(),
    getFileReadable: jest.fn().mockReturnValue(mockFileReadable),
    deleteFile: jest.fn(),
  };

  it("should add csv products to the repository", async () => {
    const csvProductListProcessor = new CsvProductListProcessor(
      mockFileStorage,
      mockRepository,
    );
    await csvProductListProcessor.execute("test_filename");
    expect(mockRepository.addProduct).toBeCalledWith(mockProductList[0]);
  });

  it("should return error with invalid csv", async () => {
    const mockWrongFormatFile = Buffer.from("test_wrong");

    mockFileStorage.getFileReadable = jest
      .fn()
      .mockReturnValue(mockWrongFormatFile);

    const csvProductListProcessor = new CsvProductListProcessor(
      mockFileStorage,
      mockRepository,
    );

    expect(
      csvProductListProcessor.execute("test_filename"),
    ).rejects.toThrowError("input.on is not a function");
  });
});
