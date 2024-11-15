import express from "express";
import cors from "cors";
import ENV from "./config/enviroment.config.js";
import statusRouter from "./routes/status.router.js";
import authRouter from "./routes/auth.router.js";
import productRouter from "./routes/products.router.js";

// This imports are to run those files
import mongoose from "./db/configMongoDB.js";
import database_pool from "./db/configMysql.js";
import transporter from "./config/transporter.config.js";
import ProductRepository from "./repositories/product.repository.js";

const app = express();
const PORT = ENV.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "5mb" }));

app.use((req, res, next) => {
  console.log(`${req.method} ==> ${req.url}`);
  next();
});

// app.use(verifyApiKeyMiddleware);

app.use("/api/status", statusRouter);
app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);

ProductRepository.getAll();

app.listen(PORT, () => {
  console.log(`Server running on port http://127.0.0.1:${PORT} 🚀`);
});
