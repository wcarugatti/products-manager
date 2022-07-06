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
  let currentProductId: string;

  it("should add csv file to the queue and to storage", async () => {
    const res = await request(app)
      .post("/product-list")
      .attach("csvFile", path.resolve(__dirname, "..", "./mocks/products.csv"))
      .expect(200);

    jobId = res.body.jobId;
  });

  it("should return file status", async () => {
    await new Promise((delay) => setTimeout(delay, 2000));
    const statusResponse = await request(app)
      .get("/product-list-status/" + jobId)
      .expect(200);
    expect(statusResponse.body.productListStatus).toBe("completed");
  });

  it("should return status code 404", async () => {
    const randomString = "random string";
    await request(app)
      .get("/product-list-status/" + randomString)
      .expect(404);
  });

  it("should return the added products", async () => {
    const res = await request(app).get("/products").expect(200);
    expect(res.body).toHaveLength(4);

    currentProductId = res.body[2].id;
  });

  it("should update product and return it updated", async () => {
    const updateResponse = await request(app)
      .patch("/product/" + currentProductId)
      .send({
        name: "test_name",
      });

    const getResponse = await request(app)
      .get("/product/" + currentProductId)
      .expect(200);
    expect(getResponse.body.name).toBe("test_name");
  });

  it("should remove product from the database", async () => {
    await request(app)
      .delete("/product/" + currentProductId)
      .expect(200);
    await request(app)
      .get("/product/" + currentProductId)
      .expect(404);
    await request(app)
      .delete("/product/" + currentProductId)
      .expect(404);
    await request(app)
      .patch("/product/" + currentProductId)
      .send({
        name: "test_name",
      })
      .expect(404);
  });
});
