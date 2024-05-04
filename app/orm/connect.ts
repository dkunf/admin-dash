//we will keep sqlite for users logging... and then Prisma for managing db operations
import sqlite3 from "sqlite3";

export const db = new sqlite3.Database(
  process.cwd() + "/app/orm/sqlite.db",
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
  (err) => {
    if (err) {
      console.error("Error connecting to SQLite database:", err);
    } else {
      console.log("Connected to SQLite database");
    }
  }
);
