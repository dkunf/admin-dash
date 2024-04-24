import { db } from "./connect";

export function runMigrations() {
  db.run(
    `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email VARCHAR(200) NOT NULL,
      password TEXT NOT NULL
  )`,
    (err) => {
      if (err) {
        console.error("Error creating table users:", err);
      } else {
        console.log("Connected to table: users");
      }
    }
  );

  db.run(
    `CREATE TABLE IF NOT EXISTS tempUsers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email VARCHAR(200) NOT NULL,
      password TEXT NOT NULL,
      conf TEXT NOT NULL
  )`,
    (err) => {
      if (err) {
        console.error("Error creating table tempUsers:", err);
      } else {
        console.log("Connected to table: tempUsers");
      }
    }
  );

  db.run(`PRAGMA foreign_keys = ON`, (err) => {
    if (err) {
      console.error("Error executing 'PRAGMA foreign_keys = ON' :", err);
    } else {
      console.log("foreign keys enabled");
    }
  });

  db.run(
    `CREATE TABLE IF NOT EXISTS sessions (
     userId INTEGER REFERENCES users(id),
     sessionId TEXT NOT NULL
  )`,
    (err) => {
      if (err) {
        console.error("Error creating table sessions:", err);
      } else {
        console.log("Connected to table: sessions");
      }
    }
  );
}
