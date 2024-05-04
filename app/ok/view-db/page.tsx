import React from "react";
import prisma from "../../../prisma/prismaInstance";
import HexGrid from "@/app/components/HexGrid/hexGrid";

async function ViewDb() {
  // const tables: { table_name: string }[] =
  //   await prisma.$queryRaw`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE';`;
  // [
  //   { table_name: "announcements_or what?" },
  //   { table_name: "product" },
  //   { table_name: "order" },
  // ];

  const tablesWithColumns: { table_name: string; column_name: string }[] =
    //     await prisma.$queryRaw`
    //   SELECT
    //     c.relname AS table_name,
    //     a.attname AS column_name
    //   FROM
    //     pg_catalog.pg_class c
    //   JOIN
    //     pg_catalog.pg_namespace n ON n.oid = c.relnamespace
    //   JOIN
    //     pg_catalog.pg_attribute a ON a.attrelid = c.oid
    //   WHERE
    //     c.relkind = 'r'
    //     AND n.nspname = 'public'
    //     AND a.attnum > 0
    //   ORDER BY
    //     c.relname,
    //     a.attnum;
    // `;
    [
      { table_name: "_prisma_migrations", column_name: "id" },
      { table_name: "_prisma_migrations", column_name: "checksum" },
      { table_name: "_prisma_migrations", column_name: "finished_at" },
      { table_name: "_prisma_migrations", column_name: "migration_name" },
      { table_name: "_prisma_migrations", column_name: "logs" },
      { table_name: "_prisma_migrations", column_name: "rolled_back_at" },
      { table_name: "_prisma_migrations", column_name: "started_at" },
      {
        table_name: "_prisma_migrations",
        column_name: "applied_steps_count",
      },
      { table_name: "announcement", column_name: "message" },
      { table_name: "announcement", column_name: "placement_id" },
      { table_name: "announcement", column_name: "attributes" },
      { table_name: "announcement", column_name: "id" },
      { table_name: "delivery_option", column_name: "operatorius" },
      { table_name: "delivery_option", column_name: "kaina" },
      { table_name: "delivery_option", column_name: "aprasymas" },
      { table_name: "delivery_option", column_name: "ar_rodoma" },
      { table_name: "delivery_option", column_name: "delivery_id" },
      { table_name: "delivery_option", column_name: "trukme_dd" },
      { table_name: "email", column_name: "email" },
      { table_name: "email", column_name: "date_subscribed" },
      { table_name: "email", column_name: "id" },
      { table_name: "faktura", column_name: "total_paid" },
      { table_name: "faktura", column_name: "total_product" },
      { table_name: "faktura", column_name: "total_delivery" },
      { table_name: "faktura", column_name: "client_name" },
      { table_name: "faktura", column_name: "client_contact" },
      { table_name: "faktura", column_name: "client_code" },
      { table_name: "faktura", column_name: "total_discount" },
      { table_name: "faktura", column_name: "date_issued" },
      { table_name: "faktura", column_name: "nr" },
      { table_name: "order", column_name: "contact" },
      { table_name: "order", column_name: "timestamp" },
      { table_name: "order", column_name: "order_nr" },
      { table_name: "order", column_name: "paid" },
      { table_name: "order", column_name: "sent_out" },
      { table_name: "order", column_name: "delivery_id" },
      { table_name: "order", column_name: "delivery_adr" },
      { table_name: "order", column_name: "pay_id" },
      { table_name: "order", column_name: "faktura_nr" },
      { table_name: "order", column_name: "total_paid" },
      { table_name: "order", column_name: "receipt_url" },
      { table_name: "order", column_name: "comments" },
      { table_name: "order", column_name: "token" },
      { table_name: "payment", column_name: "pay_id" },
      { table_name: "payment", column_name: "name" },
      { table_name: "payment", column_name: "fee" },
      { table_name: "product", column_name: "name" },
      { table_name: "product", column_name: "category" },
      { table_name: "product", column_name: "price" },
      { table_name: "product", column_name: "description" },
      { table_name: "product", column_name: "size" },
      { table_name: "product", column_name: "weight" },
      { table_name: "product", column_name: "pic_thumbnail" },
      { table_name: "product", column_name: "pic_large" },
      { table_name: "product", column_name: "prod_id" },
      { table_name: "product", column_name: "status" },
      { table_name: "product", column_name: "page" },
      { table_name: "product", column_name: "order_nr" },
      { table_name: "session", column_name: "floka_token" },
      { table_name: "session", column_name: "stripe_session" },
      { table_name: "session", column_name: "id" },
    ];

  console.log(tablesWithColumns);

  return (
    <div>
      <h1 className="text-center text-2xl py-5">Tables of your Database</h1>
      <h2 className="text-center text-l py-5">
        Click &apos;+&apos; to view and edit data
      </h2>
      <HexGrid tables={tablesWithColumns}></HexGrid>
    </div>
  );
}

export default ViewDb;
