import express from "express";
import { AccountController } from "../controllers/account/account.controller";
import { authMiddleware } from "../middleware/auth.middleware";
const accountRouter = express.Router();
const accountController = new AccountController();

accountRouter.get("/", authMiddleware, accountController.getDetailAccount);

export default accountRouter;
