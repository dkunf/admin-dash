import { User } from "../orm/localDb-files-ops";

export async function logInDataValidation(
  email: string,
  pwd: string
): Promise<string> {
  let isExistingUser = await userExist(email);
  console.log("isExistingUser: ", isExistingUser);

  let isPwdCorrect = await checkPwd(email, pwd);
  console.log("isPwdCorrect: ", isPwdCorrect);

  if (!isExistingUser || !isPwdCorrect)
    return "please check if your login information is correct";
  return "ok";
}

async function userExist(email: string): Promise<boolean> {
  //query db to see if user already exist
  if (await User.exist(email)) return true;
  return false;
}
async function checkPwd(email: string, pwd: string): Promise<boolean> {
  return await User.isPasswordCorrect(email, pwd);
}
