import request from "supertest";
import { Express } from "express";
import path from "path";
import { createExpressApp } from "../../src/infra/http/createExpressApp";

describe("addProducts", () => {
  let app: Express;
  beforeAll(async () => {
    app = await createExpressApp();
  });

  it("should add csv file to the queue and to storage", async () => {
    await request(app)
      .post("/addProducts")
      .attach("csvFile", path.resolve(__dirname, "..", "./mocks/products.csv"))
      .expect(200);
  });
});
