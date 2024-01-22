import express from "express";
import { AuthController } from "../controllers/auth/auth.controller";
const registerRouter = express.Router();
const authController = new AuthController();

registerRouter.post("/register", authController.register);
registerRouter.get("/register/verify/:code", authController.verifyRegister);
registerRouter.post("/login", authController.login);

export default registerRouter;
