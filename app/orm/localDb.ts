//for now we write/read to text file instead of db
//interesting: i need wrapper for each method which
//changes filepath and then sets it back

import { readFile, appendFile, writeFile } from "fs/promises";
import bcrypt from "bcrypt";

export const User = {
  fileLocation: process.cwd() + "/app/orm/user.txt",
  getUsers: async (): Promise<string[]> => {
    let temp: string[] = [];
    try {
      const data = await readFile(User.fileLocation, "utf-8");
      temp = data.split("\n");
      return temp;
    } catch (error) {
      console.log(error);
      return temp;
    }
  },
  //maybe indexOf better, because later i need it anyway...not always actually
  //if password is same as username of smb can be problem :)
  exist: async (str: string): Promise<boolean> => {
    try {
      const users = await User.getUsers();
      return users.includes(str);
    } catch (error) {
      console.log("could not read file");
      return false;
    }
  },
  tempExist: async (str: string): Promise<boolean> => {
    let doesExist = false;
    let saveOrigLocation = User.fileLocation;
    User.fileLocation = process.cwd() + "/app/orm/tempUsers.txt";
    doesExist = await User.exist(str);
    User.fileLocation = saveOrigLocation;
    return doesExist;
  },
  add: async (
    params: {
      email: string;
      password: string;
      uid?: string;
    },
    opt: string
  ): Promise<boolean> => {
    let hashedPwd = params.password;
    if (opt === "shouldHash") {
      try {
        hashedPwd = await bcrypt.hash(params.password, 10);
      } catch (error) {
        console.log("couldn't hash password, sorry");
        return false;
      }
    }

    try {
      let more = params.uid ? `${params.uid}\n` : "";
      await appendFile(
        User.fileLocation,
        params.email + "\n" + hashedPwd + "\n" + more,
        "utf-8"
      );
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  },
  addTemp: async (params: {
    email: string;
    password: string;
    uid?: string;
  }): Promise<boolean> => {
    let saveOrigLocation = User.fileLocation;
    User.fileLocation = process.cwd() + "/app/orm/tempUsers.txt";
    //this is not very easy for search later. better on new line!
    //but then i need to rewrite add
    let isGood = await User.add(params, "shouldHash");

    User.fileLocation = saveOrigLocation;
    return isGood;
  },
  addSession: async (user: string, sid: string): Promise<boolean> => {
    let saveOrigLocation = User.fileLocation;
    User.fileLocation = process.cwd() + "/app/orm/sessions.txt";

    //so fake, need to refactor
    let params = { email: user, password: sid };
    let isGood = await User.add(params, "no hash");

    User.fileLocation = saveOrigLocation;
    return isGood;
  },
  moveToConfirmed: async (confCode: string) => {
    let saveOrigLocation = User.fileLocation;
    User.fileLocation = process.cwd() + "/app/orm/tempUsers.txt";
    const allTempGuys = await User.getUsers();
    let lineNr = allTempGuys.indexOf(confCode);
    console.log("line number is ", lineNr);
    let params = {
      email: allTempGuys[lineNr - 2],
      password: allTempGuys[lineNr - 1],
    };
    //i need to delete somehow tempUser too
    let remainingTempGuys = [
      ...allTempGuys.slice(0, lineNr - 2),
      ...allTempGuys.slice(lineNr + 1),
    ];
    console.log("remainingTempGuys", remainingTempGuys);
    //this way we remove confirmed one
    await writeFile(User.fileLocation, remainingTempGuys.join("\n"));
    User.fileLocation = saveOrigLocation;
    User.add(params, "noHash");
  },
  isPasswordCorrect: async (user: string, pwd: string): Promise<boolean> => {
    const allUsers = await User.getUsers();
    let lineNr = allUsers.indexOf(user);
    console.log("lineNr: ", lineNr);
    if (lineNr === -1) return false;
    let existingHash = allUsers[lineNr + 1];
    return await bcrypt.compare(pwd, existingHash);
  },
  // temp:(cb: Function) =>{
  //   let saveOrigLocation = User.fileLocation;
  //   User.fileLocation = process.cwd() + "/app/orm/tempUsers.txt";
  //   const result = cb();
  //   User.fileLocation = saveOrigLocation;
  //   return result;
  // },
};
