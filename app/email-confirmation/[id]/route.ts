import {
  selectTempUserByConf,
  addNewRealUser,
  deleteFromTableObjectWhere,
} from "../../orm/dbOps";

export async function GET(req: Request) {
  //HERE WE CHECK IF THERE IS SUCH ROUTE
  let urlCode: string[] = req.url.split("/").slice(-1);
  let conf: string = urlCode[0];
  console.log("urlCode", urlCode);
  console.log("urlCode", ["b281462473c94d1d8b9395a4dc9e9b92"]);

  //let's find out if such route exist by query to tempUsers
  //we get [{email,password}] or error
  try {
    let tempUser: { [keys: string]: unknown }[] = await selectTempUserByConf(
      conf
    );
    if (!tempUser) return new Response(`this route does not exist`);
    let tempUserDetails = tempUser[0];

    // let resultOfAddingNewUser =
    console.log(await addNewRealUser(tempUserDetails));
    console.log(await deleteFromTableObjectWhere("tempUsers", `conf=${conf}`));
    return new Response(`your email has been confirmed:    ${urlCode[0]}`);
  } catch (error) {
    console.log(error);
    return new Response(`this route does not exist`);
  }
}
