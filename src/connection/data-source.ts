import { DataSource } from "typeorm";

export const dataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "1",
  database: "app",
  entities: ["src/entity/*/*entity.ts"],
  logging: true,
  synchronize: true,
});
