import { Router } from "express";
import FileController from "./../../controllers/FileController";
import { csvUploadMiddleware } from "./../middlewares/multer";

const router = Router();

router.post("/addProducts", csvUploadMiddleware, FileController.addProducts);
router.get("/getProductListStatus/:filename", FileController.getProductListStatus);

export { router };
