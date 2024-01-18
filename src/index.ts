import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import "reflect-metadata";
import { dataSource } from "./connection/data-source";
import registerRouter from "./router/register";

dotenv.config();

async function boostrap() {
  try {
    const app = express();
    const PORT = process.env.PORT || 3000;

    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    app.use(
      cors({
        origin: process.env.PUBLIC_URL,
      })
    );

    app.use("/api/register", registerRouter);

    await dataSource.initialize();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error(error);
  }
}

boostrap();
