import { User } from "../orm/localDb";
import { sendConfirmationEmail } from "../mailing/sendEmail";

export async function createNewUser(params: {
  email: string;
  password: string;
}) {
  let itWorked = false;
  const users = await User.exist(params.email);
  //first user is added to temp location, after he confirms email, he is moved to db
  if (!users) {
    itWorked = await User.addTemp(params);
    if (itWorked) sendConfirmationEmail(params.email);
  }
  return itWorked;
}
