import express from "express";
import {
  registerUserController,
  verifyMailValidationTokenController,
  loginController,
  forgotPasswordController,
  resetPasswordController,
} from "../controllers/auth.controller.js";
import { verifyApiKeyMiddleware } from "../middlewares/auth.middleware.js";

const authRouter = express.Router();

authRouter.post("/register", verifyApiKeyMiddleware, registerUserController);
authRouter.post("/login", verifyApiKeyMiddleware, loginController);
authRouter.post("/forgot-password", verifyApiKeyMiddleware, forgotPasswordController);
authRouter.get("/verify/:verification_token", verifyMailValidationTokenController);
authRouter.put("/reset-password/:reset_token", verifyApiKeyMiddleware, resetPasswordController);

export default authRouter;
