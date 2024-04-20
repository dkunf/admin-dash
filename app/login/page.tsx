import React from "react";
import {
  logInDataValidation,
  userExist,
} from "@/app/validation/logInDataValidation";
import { revalidatePath } from "next/cache";
import { createNewUser } from "@/app/auth/createNewUser";

let hasMistake = false;
let msg = "";

async function LogIn() {
  async function loginUser(formData: FormData) {
    "use server";

    hasMistake = false;
    const email = formData.get("email");
    const pwd = formData.get("password");

    //i did not decide yet what to show to user yet
    //this would run this component again to update ui (we are on server)
    //revalidatePath("/signup")

    console.log(email, pwd);
    //check it
    //as string is ok because its required field
    msg = logInDataValidation(email as string, pwd as string);
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
      action={loginUser}
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
        Enter Your Password
        <input required className="rounded" type="password" name="password" />
      </label>
      {hasMistake && <p style={{ color: "red" }}>{msg}</p>}
      <button className="flex border p-2 rounded bg-stone-100 hover:bg-stone-200 shadow">
        Log In
      </button>
    </form>
  );
}

export default LogIn;
