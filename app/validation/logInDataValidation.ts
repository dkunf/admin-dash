import { selectUserByEmail } from "../orm/dbOps";

export async function logInDataValidation(
  email: string,
  pwd: string
): Promise<string> {
  if (await checkCredentials(email, pwd)) return "no";
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
