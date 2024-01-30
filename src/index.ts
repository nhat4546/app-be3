import bodyParser from "body-parser";
import cors from "cors";
import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import "reflect-metadata";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { dataSource } from "./connection/data-source";
import accountRouter from "./router/account.router";
import authRouter from "./router/auth.router";

declare global {
  namespace Express {
    interface Request {
      account: {
        id: number;
        email: string;
        avatarUrl: string;
      };
    }
  }
}

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Express API for JSONPlaceholder",
    version: "1.0.0",
    description:
      "This is a REST API application made with Express. It retrieves data from JSONPlaceholder.",
    license: {
      name: "Licensed Under MIT",
      url: "https://spdx.org/licenses/MIT.html",
    },
    contact: {
      name: "JSONPlaceholder",
      url: "https://jsonplaceholder.typicode.com",
    },
  },
  servers: [
    {
      url: `http://localhost:${process.env.PORT}`,
      description: "Development server",
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ["./router/*.ts"],
};
const swaggerSpec = swaggerJSDoc(options);

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

    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    app.use("/images", express.static("images"));
    app.use("/api/auth", authRouter);
    app.use("/api/account", accountRouter);

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
