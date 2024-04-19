// import { SignJWT } from "jose";
import { User } from "../orm/localDb";

export async function createNewUser(params: {
  email: string;
  password: string;
}) {
  const users = await User.exist(params.email);
  console.log(users);
  if (!users) await User.add(params);
}
