// TODO: Refactor to Promises
//Then use async await
//Use transactions on DB, otherwise no guarantee it all works

import { db } from "./connect";
import { runMigrations } from "./migrations";

runMigrations();

////////////////////////////////////////////////////////////////////////////
/////////////GENERIC CRUD FUNCTIONS - MAYBE NOT NEEDED DIRECTLY/////////////
///////////////BUT USEFUL TO DERIVE PARTIALLY APPLIED FUNCTIONS/////////////

//generic INSERT
//INSERT INTO table (keys,...) VALUES (values,...)
//INSERT INTO table (a,b,c) VALUES (?,?,?)
export const insertIntoTableObject = (
  cb: Function,
  tableName: string,
  obj: { [keys: string]: unknown }
) => {
  let keys = Object.keys(obj);
  let values = Object.values(obj);
  let questionMarks = values.map((el) => "?").join(",");

  let sql = `INSERT INTO ${tableName}(${keys}) VALUES (${questionMarks})`;
  console.log(sql);
  console.log("values: ", values);

  db.run(sql, values, (err) => {
    console.log(err);
    cb("ok", err);
  });
};

//generic SELECT
//SELECT col1, col2,... FROM table WHERE col4=val;
export const selectFromTableKeysWhere = (
  cb: Function,
  tableName: string,
  cols: string[] = ["*"],
  keyAndOperator: string = "",
  val: any = ""
) => {
  if (keyAndOperator !== "") {
    if (!keyAndOperator.match(/[=><]/g))
      throw new Error(
        "3rd argument should be condition to determine which object to select"
      );
  }

  let wherePart: string;
  keyAndOperator === ""
    ? (wherePart = "")
    : (wherePart = `WHERE ${keyAndOperator} ?`);

  let sql = `SELECT ${cols} FROM ${tableName} ${wherePart}`;
  console.log(sql);

  if (wherePart === "")
    //db.all returns array, db.get returns 1 object
    db.all(sql, (err: Error, rows: any[]) => {
      if (err) {
        cb(null, err);
      } else cb(rows, null);
    });
  else {
    db.all(sql, [val], (err: Error, rows: any[]) => {
      if (err) {
        cb(null, err);
      } else cb(rows, null);
    });
  }
};

//generic UPDATE
//UPDATE mytable SET a = 5 WHERE a > 0;
export const updateTableSetKeyToValueWhere = (
  tableName: string,
  key: string,
  value: string,
  where: string = ""
) => {
  if (!where.match(/[=><]/g))
    throw new Error(
      "4th argument should be condition to determine which object to update"
    );

  //need to change to WHERE x = ?
  let wherePart: string;
  where === "" ? (wherePart = "") : (wherePart = `WHERE ${where}`);

  let sql = `UPDATE ${tableName} SET ${key} = ? ${wherePart}`;
  db.run(sql, [value], (err) => {
    console.log(err);
  });
  console.log(sql);
};

//generic DELETE
//DELETE FROM products WHERE price = 10;
export const deleteFromTableObjectWhere = (
  cb: Function,
  tableName: string,
  where: string
) => {
  if (!where.match(/[=]/g))
    throw new Error(
      "2nd argument should be condition to determine which object to delete"
    );
  let lWhere = where.split("=")[0];
  let rWhere = where.split("=")[1];

  let sql = `DELETE FROM ${tableName} WHERE  ${lWhere} = ?`;
  console.log(sql + rWhere);
  db.run(sql, [rWhere], (err: Error) => cb(err));
};

////////////////////////////////////////////////////////////////////////////
///////////////////////DERIVED FUNCTIONS////////////////////////////////////
////////////////////////////////////////////////////////////////////////////

export const selectById = (cb: Function, tableName: string, id: number) => {
  selectFromTableKeysWhere(cb, tableName, ["*"], "id = ", id);
};

export const selectUserByEmail = (cb: Function, email: string) => {
  return selectFromTableKeysWhere(cb, "users", ["*"], "email = ", email);
};

export function selectAll(cb: Function, tableName: string) {
  return selectFromTableKeysWhere(cb, tableName, ["*"]);
}

//conf is confirmation route:   "/email-confirmation/[conf]"
export const selectTempUserByConf = (cb: Function, conf: string) => {
  return selectFromTableKeysWhere(
    cb,
    "tempUsers",
    ["email", "password"],
    "conf = ",
    conf
  );
};

export const addNewRealUser = (
  cb: Function,
  obj: { [keys: string]: unknown }
) => {
  insertIntoTableObject(cb, "users", obj);
};

export const addNewTempUser = (
  cb: Function,
  obj: { [keys: string]: unknown }
) => {
  insertIntoTableObject(cb, "tempUsers", obj);
};
