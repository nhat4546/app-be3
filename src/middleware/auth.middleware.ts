import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/common";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const [type, token] = req.headers.authorization?.split(" ") ?? [];
  if (type !== "Bearer") {
    throw new Error("UNAUTHORIZED");
  }
  try {
    const payload: any = verifyToken(token, process.env.JWT_ACCESS_TOKEN || "");
    req.account = payload;
    next();
  } catch (error: any) {
    if (error.message === "jwt expired") {
      throw new Error("TOKEN_EXPIRED");
    }
    throw new Error("UNAUTHORIZED");
  }
};
