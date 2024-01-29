import express from "express";
import multer from "multer";
import { AccountController } from "../controllers/account/account.controller";
import { UserController } from "../controllers/user/user.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { avatarMiddleware } from "../middleware/avatar.middleware";

const accountRouter = express.Router();
const accountController = new AccountController();
const userController = new UserController();

const storage = multer.memoryStorage();
const upload = multer({ storage });

accountRouter.get("/profile", authMiddleware, accountController.getDetailAccount);
accountRouter.put(
  "/profile",
  authMiddleware,
  upload.single("avatar"),
  avatarMiddleware,
  userController.updateProfile
);

export default accountRouter;
