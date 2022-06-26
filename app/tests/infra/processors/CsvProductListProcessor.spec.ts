import { FileStorage } from "../../../src/interfaces/infra/FileStorage";
import { ProductsRepository } from "../../../src/interfaces/repositories/ProductsRepository";
import CsvProductListProcessor from "../../../src/infra/processors/CsvProductListProcessor";
import fs from "fs";
import path from "path";
import mockProductList from "../../mocks/mockProductList";

describe("ProcessCsvProducts", () => {
  const mockRepository: ProductsRepository = {
    addProducts: jest.fn(),
  };

  const mockFile = fs.readFileSync(
    path.resolve(__dirname, "..", "..", "./mocks/products.csv"),
  );

  const mockFileStorage: FileStorage = {
    upload: jest.fn(),
    getFile: jest.fn().mockReturnValue(mockFile),
    deleteFile: jest.fn()
  };

  it("should add csv products to the repository", async () => {
    const csvProductListProcessor = new CsvProductListProcessor(
      mockFileStorage,
      mockRepository,
    );
    await csvProductListProcessor.execute("test_filename");
    expect(mockRepository.addProducts).toBeCalledWith(mockProductList);
  });

  it("should return error with invalid csv", async () => {
    const mockWrongFormatFile = Buffer.from("test_wrong");

    mockFileStorage.getFile = jest.fn().mockReturnValue(mockWrongFormatFile);

    const csvProductListProcessor = new CsvProductListProcessor(
      mockFileStorage,
      mockRepository,
    );

    expect(
      csvProductListProcessor.execute("test_filename"),
    ).rejects.toThrowError("Wrong csv format");
  });
});
