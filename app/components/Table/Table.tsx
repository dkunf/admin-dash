// import React from "react";
// import prisma from "@/prisma/prismaInstance";
// import { PrismaClient } from "@prisma/client";

// type TableName = keyof PrismaClient;

// async function Table(props:{table_name:TableName}) {
//     let allRows:any[]

//     if(props.table_name)
//      allRows = await prisma[props.table_name].findMany();

//   return (
//     <div>
//       <h1>{props.table_name as string}</h1>

// {/*
//       <button onClick={handleButtonClick}>Show Additional Component</button>
//       {showAdditionalComponent && <AdditionalComponent />} */}
//     </div>
//   );
// }

// export default Table;
