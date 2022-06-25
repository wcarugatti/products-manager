import { Router } from "express";
import FileController from "./../../controllers/FileController";
import { csvUploadMiddleware } from "./../middlewares/multer";

const router = Router();

router.post("/addProductList", csvUploadMiddleware, FileController.addProductList);
router.get("/getProductListStatus/:jobId", FileController.getProductListStatus);

export { router };
