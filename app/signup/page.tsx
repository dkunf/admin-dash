//TODO
//refactor this to invoke try createUser immediately so here code is clean
//then inside of it there will be checks and whatnot with bubbling up errors
//remember zod

import { signUpDataValidation } from "@/app/validation/signUpDataValidation";
import { revalidatePath } from "next/cache";
import { addNewTempUser } from "../orm/dbOps";
import { v4 } from "uuid";
import { sendConfirmationEmail } from "../mailing/sendEmail";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
import Link from "next/link";

let hasMistake = false;
let msg = "";

async function SignUp() {
  async function registerNewUser(formData: FormData) {
    "use server";

    hasMistake = false;
    const email = formData.get("email");
    const pwd = formData.get("password");
    const pwdAgain = formData.get("password-again");

    console.log(email, pwd, pwdAgain);

    //as string is ok because its required field
    msg = signUpDataValidation(
      email as string,
      pwd as string,
      pwdAgain as string
    );

    if (msg !== "ok") {
      hasMistake = true;
      console.log("msg");
      revalidatePath("./signup");
    } else {
      try {
        let hashedPwd = await bcrypt.hash(pwd as string, 10);
        let conf = v4();

        console.log(
          await addNewTempUser({
            email: email,
            password: hashedPwd,
            conf: conf,
          })
        );
        sendConfirmationEmail(email as string, conf);
        //here we need redirect to page where we say please check your email and confirm signup
      } catch (error) {
        console.log(error);
        msg = "could not add new user to database";
        console.log("could not add new user to database");
        hasMistake = true;
        return false;
      }
    }
  }

  return (
    <div className="h-screen w-screen flex flex-col gap-4 items-center justify-center">
      <h1 className="text-2xl text-center">Sign Up</h1>
      <h2 className="text-l text-center">to manage data in your database</h2>
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
        <Link className="self-end" href="./">
          Login
        </Link>
      </form>
    </div>
  );
}

export default SignUp;
