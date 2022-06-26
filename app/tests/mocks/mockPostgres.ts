import { DataType, IMemoryDb, newDb } from "pg-mem";
import { v4 } from "uuid";
export const mockPostgres = async (): Promise<IMemoryDb> => {
  const database = newDb();

  database.public.registerFunction({
    implementation: () => "test",
    name: "current_database",
  });

  database.public.registerFunction({
    name: "uuid_generate_v4",
    returns: DataType.text,
    implementation: v4,
    impure: true,
  });

  const connection = await database.adapters.createTypeormDataSource({
    type: "postgres",
    database: "default_database",
    entities: ["src/infra/postgres/models/**/*.ts"],
  });

  await connection.initialize();
  await connection.synchronize();

  return database;
};
