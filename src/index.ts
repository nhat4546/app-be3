import express from "express";
import cors from "cors";
import "reflect-metadata";
import { dataSource } from "./connection/data-source";
import registerRouter from "./router/register";

dataSource
  .initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(
  cors({
    origin: process.env.PUBLIC_URL,
  })
);

app.use("/api/register", registerRouter);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
