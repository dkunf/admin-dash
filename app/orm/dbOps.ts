import { Database } from "sqlite3";

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
  cb: Function,
  tableName: string,
  cols: string[] = ["*"],
  keyAndOperator: string = "",
  val: any = ""
) => {
  //SELECT col1, col2,... FROM table WHERE col4=val;
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
  // let result: any[] | null = [];
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
  db.run(sql, (err: Error) => {
    if (err) console.log(err);
    else {
      console.log("deleted smth...");
    }
  });
};

//////////////////DERIVED FUNCTIONS//////////////////////////////
//how to create partially applied function
//let's get some specific f derived from our select monster
//what will happen with cb????
export const selectById = (cb: Function, tableName: string, id: number) => {
  selectFromTableKeysWhere(cb, tableName, ["*"], "id = ", id);
};

export function selectAll(cb: Function, tableName: string) {
  return selectFromTableKeysWhere(cb, tableName, ["*"]);
}

export const selectTempUserByConf = (cb: Function, conf: string) => {
  selectFromTableKeysWhere(
    cb,
    "tempUsers",
    ["email", "password"],
    "conf = ",
    conf
  );
};
