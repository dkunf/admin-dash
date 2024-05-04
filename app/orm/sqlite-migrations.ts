// import { Database } from "sqlite3";

// let db = new Database("./sqlite.db");

/*
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email VARCHAR(200) NOT NULL,
    password TEXT NOT NULL
);

*/

/*
CREATE TABLE IF NOT EXISTS tempUsers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email VARCHAR(200) NOT NULL,
    password TEXT NOT NULL,
    conf TEXT NOT NULL
);
*/

// PRAGMA foreign_keys = ON;

/*
CREATE TABLE IF NOT EXISTS sessions (
   userId INTEGER REFERENCES users(id),
   sessionId TEXT NOT NULL
);
*/
