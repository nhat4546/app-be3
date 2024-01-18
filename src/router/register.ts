import { register } from "../controllers/resgiter";
import express from "express";

const registerRouter = express.Router();

registerRouter.post("/", register);

export default registerRouter;
