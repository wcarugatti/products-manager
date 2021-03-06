import { mockPostgres } from "./../../mocks/mockPostgres";
import ProductsRepositoryPostgres from "./../../../src/infra/postgres/repositories/ProductsRepositoryPostgres";
import { IMemoryDb, QueryResult } from "pg-mem";
import mockProductList from "../../mocks/mockProductList";

describe("ProductsRepositoryPostgres", () => {
  let mockDatabase: IMemoryDb;
  let productsRepositoryPostgres: ProductsRepositoryPostgres;
  let data: QueryResult;
  beforeAll(async () => {
    mockDatabase = await mockPostgres();
    productsRepositoryPostgres = new ProductsRepositoryPostgres();
  });

  const refreshData = () =>
    (data = mockDatabase.public.query("SELECT * FROM products"));

  it("should create, read, update and delete products from the database", async () => {
    refreshData();
    expect(data.rows).toHaveLength(0);

    for (const product of mockProductList) {
      await productsRepositoryPostgres.addProduct(product);
    }

    refreshData();
    expect(data.rows.length).toBe(4);
    expect(data.rows[0].description).toBe(mockProductList[0].description);
    expect(data.rows[0].name).toBe(mockProductList[0].name);
    expect(data.rows[0].price).toBe(mockProductList[0].price);

    const deletedId = data.rows[0].id;
    await productsRepositoryPostgres.removeProduct(deletedId);
    refreshData();
    expect(data.rows.length).toBe(3);
    expect(data.rows.find((row) => row.id === deletedId)).toBe(undefined);

    const updatedId = data.rows[2].id;
    const updatedDescription = "testDescription";
    await productsRepositoryPostgres.updateProduct(updatedId, {
      description: updatedDescription,
    });
    refreshData();
    const updatedRow = data.rows.find((row) => row.id === updatedId);
    expect(updatedRow.description).toBe("testDescription");

    const allProducts = await productsRepositoryPostgres.getProducts();
    expect(data.rows.length).toBe(allProducts.length);
    expect(data.rows[2].description).toBe(allProducts[2].description);

    const selectedProduct = data.rows[1];
    const product = await productsRepositoryPostgres.getProduct(
      selectedProduct.id,
    );
    expect(selectedProduct.description).toBe(product.description);
  });
});
