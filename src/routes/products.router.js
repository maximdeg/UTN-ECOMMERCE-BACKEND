import express from "express";
import { verifyApiKeyMiddleware, verifyTokenMiddleware } from "../middlewares/auth.middleware.js";
import {
  createProductController,
  deleteProductController,
  getAllProductsController,
  getProductByIdController,
  updateProductByIdController,
} from "../controllers/product.controller.js";

const productRouter = express.Router();

productRouter.use(verifyApiKeyMiddleware);

productRouter.get("/", verifyTokenMiddleware(), getAllProductsController);
productRouter.get("/:product_id", verifyTokenMiddleware(), getProductByIdController);
productRouter.post("/", verifyTokenMiddleware(["admin", "seller"]), createProductController);
productRouter.put("/:product_id", verifyTokenMiddleware(["seller", "admin"]), updateProductByIdController);
productRouter.delete("/:product_id", verifyTokenMiddleware(["seller", "admin"]), deleteProductController);

export default productRouter;
