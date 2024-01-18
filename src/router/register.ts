import express from "express";
import { register } from "../controllers/register/resgiter.controller";

const registerRouter = express.Router();

registerRouter.post("/", register);

export default registerRouter;
