//for now we write/read to text file instead of db
import { readFile, appendFile } from "fs/promises";

export const User = {
  fileLocation: process.cwd() + "/app/orm/data.txt",
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
  exist: async (email: string): Promise<boolean> => {
    try {
      const users = await User.getUsers();
      return users.includes(email);
    } catch (error) {
      console.log("could not read file");
      return false;
    }
  },
  add: async (params: {
    email: string;
    password: string;
  }): Promise<boolean> => {
    try {
      await appendFile(
        User.fileLocation,
        params.email + "\n" + params.password + "\n",
        "utf-8"
      );
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  },
};
