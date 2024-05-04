import { selectUserByEmail } from "../orm/dbOps";
import bcrypt from "bcrypt";

export async function logInDataValidation(
  email: string,
  pwd: string
): Promise<string> {
  let hashedPwd = await bcrypt.hash(pwd as string, 10);

  if (await checkCredentials(email, hashedPwd)) return "no";
  return "ok";
}

async function checkCredentials(email: string, pwd: string): Promise<boolean> {
  try {
    let rows = await selectUserByEmail(email);
    if (rows) {
      let em = rows[0].email;
      let pas = rows[0].password;
      return em === email && pas === pwd;
    } else return false;
  } catch {
    return false;
  }
}
