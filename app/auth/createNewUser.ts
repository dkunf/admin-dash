import { User } from "../orm/localDb-files-ops";
import { sendConfirmationEmail } from "../mailing/sendEmail";
import { v4 } from "uuid";
import { sign, verify } from "jsonwebtoken";

export async function createNewUser(params: {
  email: string;
  password: string;
  uid?: string;
}) {
  let itWorked = false;
  const users = await User.exist(params.email);
  //first user is added to temp location, after he confirms email, he is moved to db
  if (!users) {
    params.uid = v4();
    itWorked = await User.addTemp(params);
    if (itWorked) sendConfirmationEmail(params.email, params.uid);
  }
  return itWorked;
}
export async function startSession(user: string) {
  let sessionId = v4();
  User.addSession(user, sessionId);
  let secret = process.env.JWT_SECRET;
  console.log("secret: ", secret);

  const token = sign({ sid: sessionId }, secret as string);
  console.log(token);
}
