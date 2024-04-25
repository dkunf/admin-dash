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
) => {
  let keys = Object.keys(obj);
  let values = Object.values(obj);
  let questionMarks = values.map((el) => "?").join(",");

  let sql = `INSERT INTO ${tableName}(${keys}) VALUES (${questionMarks})`;
  console.log(sql);

  db.run(sql, values, (err) => {
    console.log(err);
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
  tableName: string,
  where: string
) => {
  if (!where.match(/[=]/g))
    throw new Error(
      "2nd argument should be condition to determine which object to delete"
    );
  let lWhere = where.split("=")[0];
  let rWhere = where.split("=")[1];

  let sql = `DELETE FROM ${tableName} WHERE  ${lWhere}=?`;
  console.log(sql);
  db.run(sql, [rWhere], (err: Error) => {
    if (err) console.log(err);
    else {
      console.log(`in table ${tableName} deleted row with ${where}`);
    }
  });
};

////////////////////////////////////////////////////////////////////////////
///////////////////////DERIVED FUNCTIONS////////////////////////////////////
////////////////////////////////////////////////////////////////////////////

export const selectById = (cb: Function, tableName: string, id: number) => {
  selectFromTableKeysWhere(cb, tableName, ["*"], "id = ", id);
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

export const addNewRealUser = (obj: { [keys: string]: unknown }) => {
  insertIntoTableObject("users", obj);
};