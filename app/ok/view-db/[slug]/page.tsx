import React from "react";
import prisma from "@/prisma/prismaInstance";
// import {inputIsValid} from '@/app/validation/inputIsValid'

async function TableForm({ params }: { params: { slug: string } }) {
  async function handleFormSubmit(formData: FormData) {
    "use server";

    console.log(formData);
    //TO DO
    //  if(inputIsValid(formData)) {
    //   for (const [key, value] of formData.entries()) {
    //     const result = await prisma.$executeRaw`
    //     INSERT INTO {params.slug} (${Object.keys(formData)})
    //     VALUES (${formData.value});
    //   `;
    //   }

    // }add to db
  }

  interface TableColumn {
    column_name: string;
    data_type: string;
  }

  const columns: TableColumn[] =
    await prisma.$queryRaw`SELECT column_name, data_type 
  FROM information_schema.columns 
  WHERE table_name = ${params.slug};`;

  console.log(params.slug);

  console.log(columns);

  return (
    <form
      action={handleFormSubmit}
      className="text-center p-8 grid-cols-2 gap-4 auto-cols-min"
    >
      <h1 className="text-center text-xl">{params.slug.toUpperCase()}</h1>
      {columns.map((column) => (
        <div className="m-4" key={column.column_name}>
          <label className="p-4 w-40" htmlFor={column.column_name}>
            {column.column_name}
          </label>
          <br></br>
          <input
            className="text-white bg-black p-2 m-1 w-3/4"
            type={column.data_type === "text" ? "text" : "number"}
            id={column.column_name}
            name={column.column_name}
          />
          <hr />
        </div>
      ))}
      <button
        className="px-8 py-4 bg-white text-black border-1 rounded"
        type="submit"
      >
        Submit
      </button>
    </form>
  );
}

export default TableForm;
