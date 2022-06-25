import request from "supertest";
import { Express } from "express";
import path from "path";
import { createExpressApp } from "../../src/infra/http/createExpressApp";

describe("Product List integration test", () => {
  let app: Express;
  beforeAll(async () => {
    app = await createExpressApp();
  });
  let newFilename: string;

  it("should add csv file to the queue and to storage", async () => {
    const res = await request(app)
      .post("/addProductList")
      .attach("csvFile", path.resolve(__dirname, "..", "./mocks/products.csv"))
      .expect(200);

    newFilename = res.body.newFilename;
  });

  it("should return file status", async () => {
    await request(app)
      .get("/getProductListStatus/" + newFilename)
      .expect(200);
  });
  
  it("should return status code 404", async () => {
    const randomFilename = "random filename"
    await request(app)
      .get("/getProductListStatus/" + randomFilename)
      .expect(404);
  });
});
