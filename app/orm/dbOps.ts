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
  tableName: string,
  obj: { [keys: string]: unknown }
): Promise<string> => {
  let keys = Object.keys(obj);
  let values = Object.values(obj);
  let questionMarks = values.map((el) => "?").join(",");

  let sql = `INSERT INTO ${tableName}(${keys}) VALUES (${questionMarks})`;
  console.log(sql);
  console.log("values: ", values);

  return new Promise((resolve, reject) => {
    db.run(sql, values, (err) => {
      if (err) reject(err);
      else
        resolve(`success:
      INSERT INTO ${tableName}(${keys}) VALUES (${values})`);
    });
  });
};

//generic SELECT
//SELECT col1, col2,... FROM table WHERE col4=val;
export const selectFromTableKeysWhere = (
  tableName: string,
  cols: string[] = ["*"],
  keyAndOperator: string = "",
  val: any = ""
): Promise<{ [keys: string]: unknown }[]> => {
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
    return new Promise((resolve, reject) => {
      db.all(sql, (err: Error, rows: any[]) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  else {
    return new Promise((resolve, reject) => {
      db.all(sql, [val], (err: Error, rows: any[]) => {
        if (err) {
          reject(err);
        } else resolve(rows);
      });
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
): Promise<string> => {
  if (!where.match(/[=><]/g))
    throw new Error(
      "4th argument should be condition to determine which object to update"
    );
  let rWhere = where.split("=")[1];
  let lWhere = where.split("=")[0];

  //need to change to WHERE x >= ?
  let wherePart: string;
  where === "" ? (wherePart = "") : (wherePart = `WHERE ${lWhere}=?`);

  let sql = `UPDATE ${tableName} SET ${key} = ? ${wherePart}`;
  console.log(sql);
  return new Promise((resolve, reject) => {
    db.run(sql, [value, rWhere], (err) => {
      if (err) reject(err);
      else
        resolve(`success: 
    UPDATE ${tableName} SET ${key} = ${value} WHERE ${lWhere}=${rWhere}
    `);
    });
  });
};

//generic DELETE
//DELETE FROM products WHERE price = 10;
export const deleteFromTableObjectWhere = (
  tableName: string,
  where: string
): Promise<string> => {
  if (!where.match(/[><=]/g))
    throw new Error(
      "2nd argument should be condition to determine which object to delete"
    );
  let lWhere = where.split("=")[0];
  let rWhere = where.split("=")[1];

  let sql = `DELETE FROM ${tableName} WHERE  ${lWhere} = ?`;
  console.log(sql + rWhere);
  return new Promise((resolve, reject) => {
    db.run(sql, [rWhere], (err: Error) => {
      if (err) reject(err);
      else
        resolve(`success: 
      DELETE FROM ${tableName} WHERE  ${lWhere}= ${rWhere} 
      `);
    });
  });
};

////////////////////////////////////////////////////////////////////////////
///////////////////////DERIVED FUNCTIONS////////////////////////////////////
////////////////////////////////////////////////////////////////////////////

export const selectById = async (tableName: string, id: number) => {
  return await selectFromTableKeysWhere(tableName, ["*"], "id = ", id);
};

export const selectUserByEmail = async (email: string) => {
  return await selectFromTableKeysWhere("users", ["*"], "email = ", email);
};

export async function selectAll(tableName: string) {
  return await selectFromTableKeysWhere(tableName, ["*"]);
}

//conf is confirmation route:   "/email-confirmation/[conf]"
export const selectTempUserByConf = async (
  conf: string
): Promise<{ [keys: string]: unknown }[]> => {
  return await selectFromTableKeysWhere(
    "tempUsers",
    ["email", "password"],
    "conf = ",
    conf
  );
};

export const addNewRealUser = async (obj: { [keys: string]: unknown }) => {
  await insertIntoTableObject("users", obj);
};

export const addNewTempUser = async (obj: { [keys: string]: unknown }) => {
  await insertIntoTableObject("tempUsers", obj);
};
