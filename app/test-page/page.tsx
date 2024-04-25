//TEST PAGE
import React from "react";
import {
  insertIntoTableObject,
  selectFromTableKeysWhere,
  updateTableSetKeyToValueWhere,
  deleteFromTableObjectWhere,
  selectById,
  selectAll,
  selectTempUserByConf,
  addNewTempUser,
} from "../orm/dbOps";
import { v4 } from "uuid";
import bcrypt from "bcrypt";

async function SignUp() {
  async function registerNewUser(formData: FormData) {
    "use server";

    const email = formData.get("email");
    const pwd = formData.get("password");
    const pwdAgain = formData.get("password-again");
    console.log(email, pwd, pwdAgain);
    //revalidatePath("/signup")

    let hashedPwd = await bcrypt.hash(pwd as string, 10);
    try {
      console.log(
        await addNewTempUser({
          email: email,
          password: hashedPwd,
          conf: v4(),
        })
      );
    } catch (error) {
      console.log(error);
      return false;
    }

    //is it good idea to make global cb???
    // const cb = (data: any[] | null, err: Error) => {
    //   if (err) console.log(err);
    //   else console.log(data); //i can receive data here and wrk on it
    // };

    //let's create user
    try {
      let result = await insertIntoTableObject("tempUsers", {
        email: email,
        password: hashedPwd,
        conf: v4(),
      });
      console.log(result);
    } catch (error) {
      console.log(error);
    }

    //let's view user
    //so annoying to get results via cb
    try {
      let result = await selectFromTableKeysWhere(
        "tempUsers",
        ["email", "password"],
        "id=",
        3
      );
      console.log(result);
    } catch (error) {
      console.log(error);
    }

    //lets get user by id
    selectById("tempUsers", 6);

    //lets get all tempUsers
    selectAll("tempUsers");

    //lets update user info
    try {
      let result = await updateTableSetKeyToValueWhere(
        "tempUsers",
        "email",
        "da@da.ad",
        "id=4"
      );
      console.log(result);
    } catch (error) {
      console.log(error);
    }
    // let's delete user
    try {
      deleteFromTableObjectWhere("tempUsers", "id=6");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <form
      action={registerNewUser}
      className="flex flex-col items-start gap-8 bg-gradient-to-br from-stone-200 to-stone-400 rounded p-12 text-black"
    >
      <label
        className="flex flex-col gap-2 sm:flex-row sm:gap-12 w-full justify-between"
        htmlFor="email"
      >
        Enter your Email
        <input required className="rounded" type="email" name="email" />
      </label>
      <label
        className="flex flex-col gap-2 sm:flex-row sm:gap-12 w-full justify-between"
        htmlFor="password"
      >
        Create a good Password
        <input required className="rounded" type="password" name="password" />
      </label>
      <label
        className="flex flex-col gap-2 sm:flex-row sm:gap-12 w-full justify-between"
        htmlFor="password-again"
      >
        Repeat your password
        <input
          required
          className="rounded"
          type="password"
          name="password-again"
        />
      </label>
      <button className="flex border p-2 rounded bg-stone-100 hover:bg-stone-200 shadow">
        Create Account
      </button>
    </form>
  );
}

export default SignUp;
