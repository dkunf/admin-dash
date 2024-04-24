//for now we write/read to text file instead of db
//interesting: i need wrapper for each method which
//changes filepath and then sets it back

import { openSync, closeSync, readFileSync, writeFileSync } from "fs";

class ORM {
  static journal = process.cwd() + "/app/orm/journal.txt";
  fileLocation: string;
  allRecords: string[] | null = null;
  constructor(location: string) {
    this.fileLocation = process.cwd() + location;
    this.allRecords = this.getAllRecords();
  }
  //need to be sync because it's needed in constructor
  getAllRecords(): string[] | null {
    if (this.allRecords && this.allRecords.length > 0) return this.allRecords;
    let fd: number | undefined = undefined;
    try {
      //i have to lock files to prevent racing problems
      fd = openSync(this.fileLocation, "r");
      const data = readFileSync(fd, "utf-8");
      this.allRecords = data.split("\n");
      return this.allRecords;
    } catch (error) {
      console.log(error);
      return null;
    } finally {
      if (fd != undefined) closeSync(fd);
    }
  }
  //todo test it
  getRecord(value: string) {
    if (!this.allRecords) return [];
    return this.allRecords.filter((obj) => {
      return Object.values(JSON.parse(obj)).includes(value);
    });
  }
  //need to test
  getRecord2(params: { [key: string]: string }) {
    if (!this.allRecords) return [];
    return this.allRecords.filter((obj) => {
      let arr: [string, unknown][] = Object.entries(JSON.parse(obj)); //[ [key,val],[key,val]... ]
      let arr2: [string, unknown][] = Object.entries(params);
      let flag = false;
      arr.forEach((element) => {
        if (JSON.stringify(element) === JSON.stringify(arr2)) {
          flag = true;
          return;
        }
      });
      return flag;
    });
  }

  //todo
  //need to hash pwd before calling this function
  addRecord(params: { [key: string]: unknown }): boolean {
    // let hashedPwd = params.password;
    // if (opt === "shouldHash") {
    //   try {
    //     hashedPwd = await bcrypt.hash(params.password, 10);
    //   } catch (error) {
    //     console.log("couldn't hash password, sorry");
    //     return false;
    //   }
    // }
    if (this.allRecords) this.allRecords.push(JSON.stringify(params));
    else this.allRecords = [JSON.stringify(params)];
    this.writeToJournal(`addRecord.bind(${this},${JSON.stringify(params)})`);
    return this.backupDB();
  }
  deleteRecord(params: { [key: string]: string }) {
    if (!this.allRecords) return false;
  }

  backupDB() {
    let fd: number | undefined = undefined;
    try {
      fd = openSync(this.fileLocation, "w");
      writeFileSync(fd, JSON.stringify(this.allRecords), "utf-8");
      return true;
    } catch (error) {
      console.log(error);
      return false;
    } finally {
      if (fd != undefined) closeSync(fd);
    }
  }
  writeToJournal(act: string) {
    let fd: number | undefined = undefined;
    try {
      fd = openSync(ORM.journal, "w");
      writeFileSync(fd, act, "utf-8");
      return true;
    } catch (error) {
      console.log(error);
      return false;
    } finally {
      if (fd != undefined) closeSync(fd);
    }
  }
}

//we have methods in ORM
//now we can create tables
const sessions = new ORM(process.cwd() + "/app/orm/sessions.txt");
const tempUsers = new ORM(process.cwd() + "/app/orm/tempUsers.txt");
const users = new ORM(process.cwd() + "/app/orm/users.txt");
