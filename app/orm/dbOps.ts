import { Database } from "sqlite3";
import bcrypt from "bcrypt";

let db = new Database(process.cwd() + "/app/orm/sqlite.db");

export const insertIntoTableObject = (
  tableName: string,
  obj: { [keys: string]: unknown }
) => {
  //INSERT INTO table (keys,...) VALUES (vals,...)
  //INSERT INTO table (a,b,c) VALUES (?,?,?)
  let keys = Object.keys(obj);
  let values = Object.values(obj);
  let questionMarks = values.map((el) => "?").join(",");

  let sql = `INSERT INTO ${tableName}(${keys}) VALUES (${questionMarks})`;
  console.log(sql);
  db.run(sql, values, (err) => {
    console.log(err);
  });
};

export const selectFromTableKeysWhere = (
  tableName: string,
  cols: string[] = ["*"],
  where: string = ""
) => {
  //SELECT col1, col2,... FROM table WHERE col4=val;
  if (!where.match(/[=><]/g))
    throw new Error(
      "3rd argument should be condition to determine which object to select"
    );

  let wherePart: string;
  where === "" ? (wherePart = "") : (wherePart = `WHERE ${where}`);

  let sql = `SELECT ${cols} FROM ${tableName} ${wherePart}`;
  console.log(sql);
};

export const updateTableSetKeyToValueWhere = (
  tableName: string,
  key: string,
  value: string,
  where: string = ""
) => {
  //UPDATE mytable SET a = 5 WHERE a > 0;
  if (!where.match(/[=><]/g))
    throw new Error(
      "4th argument should be condition to determine which object to update"
    );

  let wherePart: string;
  where === "" ? (wherePart = "") : (wherePart = `WHERE ${where}`);

  let sql = `UPDATE ${tableName} SET ${key} = ${value} ${wherePart}`;
  console.log(sql);
};

export const deleteFromTableObjectWhere = (
  tableName: string,
  where: string
) => {
  //DELETE FROM products WHERE price = 10;
  if (!where.match(/[=]/g))
    throw new Error(
      "2nd argument should be condition to determine which object to delete"
    );

  let sql = `DELETE FROM ${tableName} WHERE ${where}`;
  console.log(sql);
};
