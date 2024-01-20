import express from "express";
import { AuthController } from "../controllers/auth/auth.controller";
const registerRouter = express.Router();
const authController = new AuthController();

registerRouter.post("/register", authController.register);
registerRouter.get("/register/verify/:code", authController.verifyRegister);

export default registerRouter;
