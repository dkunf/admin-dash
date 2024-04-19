export function signUpDataValidation(
  email: string,
  p1: string,
  p2: string
): string {
  if (!email.match(/.+@.+\.\w+/g)) return "please make sure email is correct";
  if (p1 !== p2) return "please make sure you type the same password twice";
  if (p1.length < 8)
    return "please make sure your password has at least 8 characters";
  if (!p1.match(/[A-Z]/g))
    return "please make sure your password has at least 1 capital letter";
  if (!p1.match(/[!"£$%^&*()_+#~@]/g))
    return 'please make sure your password has at least 1 symbol like !"£$%^&*()_+#~@';
  if (!p1.match(/[0-9]/g))
    return "please make sure your password has at least 1 number";

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
