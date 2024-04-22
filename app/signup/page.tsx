//TODO
//refactor this to invoke try createUser immediately so here code is clean
//then inside of it there will be checks and whatnot with bubbling up errors
//remember zod

import React from "react";
import {
  signUpDataValidation,
  userExist,
} from "@/app/validation/signUpDataValidation";
import { revalidatePath } from "next/cache";
import { createNewUser } from "@/app/auth/createNewUser";

let hasMistake = false;
let msg = "";

async function SignUp() {
  async function registerNewUser(formData: FormData) {
    "use server";

    hasMistake = false;
    const email = formData.get("email");
    const pwd = formData.get("password");
    const pwdAgain = formData.get("password-again");

    //this would clear cache and run this component again to update ui (we are on server)
    //revalidatePath("/signup")

    console.log(email, pwd, pwdAgain);
    //check it
    //as string is ok because its required field
    msg = signUpDataValidation(
      email as string,
      pwd as string,
      pwdAgain as string
    );

    if (msg !== "ok" || userExist(email as string)) {
      hasMistake = true;
      console.log("msg");
      revalidatePath("./signup");
    } else {
      //now we can change route to message saying
      //plese go to your email and click the link
      let newUserIsCreated = await createNewUser({
        email: email as string,
        password: pwd as string,
      });

      if (newUserIsCreated) {
        msg = "ok";
        console.log("new user successfully created");
      } else {
        console.log("could not add new user to database");
      }
      //this cleans cache, we don't need it later, right?
      revalidatePath("./signup");
    }

    //send email with link to confirm signup

    //create that route, which will be triggered by visiting link

    //when triggered new user data should be moved from temp to user table and used for logins
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
      {hasMistake && <p style={{ color: "red" }}>{msg}</p>}
      <button className="flex border p-2 rounded bg-stone-100 hover:bg-stone-200 shadow">
        Create Account
      </button>
    </form>
  );
}

export default SignUp;
