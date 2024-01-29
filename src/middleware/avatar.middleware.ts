import fs from "fs";

import { NextFunction, Request, Response } from "express";

export const avatarMiddleware = (
  req: Request<{}, {}, { avatar: string; userName: string }>,
  res: Response,
  next: NextFunction
) => {
  if (process.env.UPLOAD_DRIVER === "s3") {
  } else {
    if (req.file) {
      const filePath = `images/${Date.now()}-${req.file.originalname}`;
      fs.writeFileSync(filePath, req.file.buffer, "binary");
      req.account = {
        ...req.account,
        avatarUrl: filePath,
      };
    }
  }
  next();
};
