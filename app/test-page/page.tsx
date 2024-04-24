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
    /*
    let hashedPwd: string;
    try {
      hashedPwd = await bcrypt.hash(pwd as string, 10);
    } catch (error) {
      console.log(error);
      return false;
    }

    //let's create user
    try {
      insertIntoTableObject("tempUsers", {
        email: email,
        password: hashedPwd,
        conf: v4(),
      });
    } catch (error) {
      console.log(error);
    }
*/

    //is it good idea to make global cb???
    const cb = (data: any[] | null, err: Error) => {
      if (err) console.log(err);
      else console.log(data);
    };

    //let's view user
    //so annoying to get results via cb
    try {
      selectFromTableKeysWhere(
        cb,
        "tempUsers",
        ["email", "password"],
        "id=",
        3
      );
    } catch (error) {
      console.log(error);
    }

    //lets get user by id
    selectById(cb, "tempUsers", 6);

    //lets get all tempUsers
    // selectAll(cb, "tempUsers");

    selectTempUserByConf((data: any[] | null, err: Error) => {
      try {
        if (data) {
          insertIntoTableObject("users", {
            email: data[0].email,
            password: data[0].password,
          });
          //also need to delete data from tempUser
          //TODO
          deleteFromTableObjectWhere("tempUser", `email = ${data[0].email}`);
        } else console.log("no temp user moved to real user");
      } catch (error) {
        console.log(error);
      }
    }, "35d2ee14-fbe9-4d5a-9320-8b68fd66c465");

    //lets update user info
    try {
      updateTableSetKeyToValueWhere("tempUsers", "email", "d@d.d", "s>3");
    } catch (error) {
      console.log(error);
    }
    //let's delete user
    //   try {
    //     deleteFromTableObjectWhere("tempUsers", "d=7");
    //   } catch (error) {
    //     console.log(error);
    //   }
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
