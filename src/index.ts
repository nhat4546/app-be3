import bodyParser from "body-parser";
import cors from "cors";
import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import "reflect-metadata";
import { dataSource } from "./connection/data-source";
import authRouter from "./router/auth.router";

async function bootstrap() {
  try {
    const app = express();
    const PORT = process.env.PORT || 3000;

    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(express.json());

    app.use(
      cors({
        origin: process.env.PUBLIC_URL,
      })
    );

    app.use("/api/auth", authRouter);

    app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
      res.status(500).json({ error: error.message });
    });

    await dataSource.initialize();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error(error);
  }
}

bootstrap();
