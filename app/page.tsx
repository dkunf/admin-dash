import React from "react";
import { logInDataValidation } from "@/app/validation/logInDataValidation";
import { revalidatePath } from "next/cache";
import { startSession } from "./auth/sessions";
import Link from "next/link";

let hasMistake = false;
let msg = "";

async function LogIn() {
  async function loginUser(formData: FormData) {
    "use server";

    hasMistake = false;
    const email = formData.get("email");
    const pwd = formData.get("password");

    console.log(email, pwd);

    msg = await logInDataValidation(email as string, pwd as string);
    if (msg !== "ok") {
      hasMistake = true;
      revalidatePath("./");
    } else {
      let token = await startSession(email as string);
    }
  }

  return (
    <div className="h-screen w-screen flex flex-col gap-4 items-center justify-center">
      <h1 className="text-2xl text-center">Log In</h1>
      <h2 className="text-l text-center">to manage data in your database</h2>
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
        <Link className="self-end" href="/signup">
          SignUp
        </Link>
        <Link className="self-end" href="/ok/view-db">
          Check your DB
        </Link>
      </form>
    </div>
  );
}

export default LogIn;
