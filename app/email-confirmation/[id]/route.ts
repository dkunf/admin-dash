import { selectTempUserByConf, addNewRealUser } from "../../orm/dbOps";

export async function GET(req: Request) {
  //HERE WE CHECK IF THERE IS SUCH ROUTE
  let urlCode = req.url.split("/").slice(-1);
  console.log("urlCode", urlCode);
  console.log("urlCode", ["b281462473c94d1d8b9395a4dc9e9b92"]);

  //callback to get answer from db
  const moveUser = (data: {}[] | null, err: Error) => {
    if (err) console.log(err);
    else {
      if (!err && data) {
        //now we move temp user to users
        addNewRealUser(data[0]);

        return new Response(
          `your email has been confirmed:    ${req.url.split("/").slice(-1)}`
        );
      } else {
        return new Response(`this route does not exist`);
      }
    } //i can receive data here and wrk on it
  };

  selectTempUserByConf(moveUser, urlCode[0]);
}
