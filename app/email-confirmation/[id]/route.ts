import { User } from "../../orm/localDb-files-ops";

export async function GET(req: Request) {
  //HERE WE CHECK IF THERE IS SUCH ROUTE
  let urlCode = req.url.split("/").slice(-1);
  console.log("urlCode", urlCode);
  console.log("urlCode", ["b281462473c94d1d8b9395a4dc9e9b92"]);

  if (await User.tempExist(urlCode[0])) {
    //now we move temp user to users
    await User.moveToConfirmed(urlCode[0]);

    return new Response(
      `your email has been confirmed:    ${req.url.split("/").slice(-1)}`
    );
  } else {
    return new Response(`this route does not exist`);
  }

  //if we have ever generated it then to which email it connects
  //we find corresponding email and move that user from temp to constant user db
}
