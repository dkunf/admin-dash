import { v4 } from "uuid";
import { sign, verify } from "jsonwebtoken";

//get id of given user
//generate id of session
//add it to sessions table
//create token with both id?
//sign token with expiration
//send it in Authorization Bearer header
export async function startSession(user: string) {
  let sessionId = v4();

  // User.addSession(user, sessionId);
  let secret = process.env.JWT_SECRET;
  console.log("secret: ", secret);

  const token = sign({ sid: sessionId }, secret as string);
  console.log(token);
}
