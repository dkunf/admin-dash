export function logInDataValidation(email: string, hashedPwd: string): string {
  if (userExist(email)) checkPwd(hashedPwd);
  return "ok";
}
//testing
// if (
//   signUpValidation("ee", "ee", "ee") === "please make sure email is correct"
// ) {
//   console.log("email check correct");
// }
export function userExist(email: string): boolean {
  //query db to see if user already exist
  return false;
}
function checkPwd(hashedPwd: string): boolean {
  return false;
}
