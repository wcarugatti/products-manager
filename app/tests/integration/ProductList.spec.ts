import request from "supertest";
import { Express } from "express";
import path from "path";
import { createExpressApp } from "../../src/infra/http/createExpressApp";

describe("Product List integration test", () => {
  let app: Express;
  beforeAll(async () => {
    app = await createExpressApp();
  });
  let jobId: string;

  it("should add csv file to the queue and to storage", async () => {
    const res = await request(app)
      .post("/addProductList")
      .attach("csvFile", path.resolve(__dirname, "..", "./mocks/products.csv"))
      .expect(200);

    jobId = res.body.jobId;
  });

  it("should return file status", async () => {
    await request(app)
      .get("/getProductListStatus/" + jobId)
      .expect(200);
  });
  
  it("should return status code 404", async () => {
    const randomString = "random string"
    await request(app)
      .get("/getProductListStatus/" + randomString)
      .expect(404);
  });
});
