import { Router } from "express";
import FileController from "./../../controllers/FileController";
import { csvUploadMiddleware } from "./../middlewares/multer";
import ProductController from './../../controllers/ProductController';

const router = Router();

router.post("/product-list", csvUploadMiddleware, FileController.addProductList);
router.get("/product-list-status/:jobId", FileController.getProductListStatus);


router.get("/products", ProductController.getProducts);
router.get("/product/:id", ProductController.getProduct);
router.patch("/product/:id", ProductController.updateProduct);
router.delete("/product/:id", ProductController.removeProduct);

export { router };
