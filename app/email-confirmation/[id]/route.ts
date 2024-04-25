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
  //we pass to callback ({}[],e)
  selectTempUserByConf(cb, conf);
  return new Response("ok");
  //INSIDE CALLBACK F
  //if user info is null, then we Respond sorry
  //otherwise we use this info to INSERT to users
  //and also to DELETE from tempUsers
  function cb(arr: { email: string; password: string }[], e: Error) {
    if (!e) {
      let userObj = arr[0];
      addNewRealUser((d: string, e: Error) => {
        if (!e) {
          console.log("new real user added");
          //now we need to delete from temp and get confirmation that it worked
          //FIX:       //doesn't delete!!!!!
          console.log("conf: ", conf);

          deleteFromTableObjectWhere(
            (e: Error) => {
              if (e) console.log(e);
            },
            "tempUsers",
            `conf='${conf.trim()}'`
          );
          return new Response(
            `your email has been confirmed:    ${urlCode[0]}`
          );
        } else {
          console.log(e);
          return new Response(`this route does not exist`);
        }
      }, userObj);
    } else {
      return new Response(`this route does not exist`);
    }
  }

  //brrrrrrr, let's start over
  /*
  const cb = (d: string, e: Error) => {
    if (!e) console.log("user added");
    else console.log(e);
  };

  //callback to get answer from db
  const moveUser = (data: {}[] | null, err: Error) => {
    if (err) console.log(err);
    else {
      if (!err && data) {
        //now we move temp user to users
        addNewRealUser(cb, data[0]);

        return new Response(
          `your email has been confirmed:    ${urlCode[0]}`
        );
      } else {
        return new Response(`this route does not exist`);
      }
    } //i can receive data here and wrk on it
  };

  selectTempUserByConf(moveUser, urlCode[0]);
*/
}
