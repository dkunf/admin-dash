import { v4 } from "uuid";
import { sign, verify } from "jsonwebtoken";
import { addSession, getUsersId } from "../orm/dbOps";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

//get id of given user
//generate id of session
//add it to sessions table
//create token with both id?
//sign token with expiration
//send it in Authorization Bearer header
export async function startSession(email: string) {
  try {
    let userId = await getUsersId(email);
    let sessionId = v4();

    let secret = process.env.JWT_SECRET;
    console.log("secret: ", secret);
    if (userId[0]) {
      const token = sign({ sid: sessionId }, secret as string, {
        expiresIn: "3d",
      });
      console.log("token: ", token);
      await addSession(userId[0].id as unknown as string, sessionId);
      revalidatePath("./");
      return token;
    }
  } catch (error) {
    console.log(error);
  }
}
// check that:
//https://apidog.com/articles/json-web-token-jwt-nodejs/
